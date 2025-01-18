import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs'
import { QuestionListSchema } from './models/question.js';

export async function generateContent() {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION;

  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyFilePath == undefined) {
    console.error('.envファイルが読み込めません');
    return;
  }

  let serviceAccountKey;

  try {
    const rawKey = fs.readFileSync(keyFilePath, 'utf-8');
    serviceAccountKey = JSON.parse(rawKey);
  } catch (error) {
    console.error('サービスアカウントキーを読み取れません:', error);
    return;
  }

  const authOptions = {
    credentials: {
      client_email: serviceAccountKey.client_email,
      private_key: serviceAccountKey.private_key,
    },
  };

  const vertexAI = new VertexAI({project: projectId, location: location, googleAuthOptions: authOptions });
  const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = '\
  英語の専門家のあなたに英語の問題を作成してほしい。 以下に具体的な情報を与えるのでその情報に従って問題を作成してください。 \
  - 問題の回答形式は4択問題\
   - 4択の選択肢は英単語 or イディオム or 英熟語 となっている。 \
   - それぞれの選択肢が同じ意味になるようなことは必ずあり得ない \
   - もし正解の解答以外の選択肢を"____"部分に当てはめた際、意味が成立してしまうことは必ずあり得ない \
   - 英単語が答えになる場合は、他の選択肢はすべて英単語 \
   - イディオムが答えになる場合は、他の選択肢はすべてイディオム \
   - 英熟語が答えになる場合は、他の選択肢はすべて英熟語 \
   - 選択肢には対応する日本語訳がある \
   - 英単語の場合は、対応する日本語は2語以上の複数の単語がある。ただし、2語以上の複数の単語に必ず重複はないものとする。もし2語以上生成をした際、重複がある場合は重複を省いたもので出力する。その結果1語になってしまうものは仕方がないものとする \
   - イディオム or 英熟語の場合は対応する日本語は1つ以上がある \
  - 問題文の形式は、英語の例文であり、答えとなる部分が”____”になっている。 \
   - 問題文には対応する日本語訳がある \
   - 問題文には対応する日本語の解説がある \
   - 問題文の解説("description")は、自然な文章で記述する。 \
  出力する問題の形式は以下の綺麗な改行や空白のないjson形式で示してほしい（問題は例） \
  ```json [{ "sentence": "I need to _____ this document before sending it.", "options": [ { "word": "review", "translation": "レビューする、確認する" }, { "word": "contain", "translation": "含む、収容する" }, { "word": "mention", "translation": "言及する、述べる" }, { "word": "describe", "translation": "説明する、描写する" } ], "correctAnswer": { "word": "review", "translation": "レビューする、確認する" }, "translation": "送信する前にこの文書を見直す必要があります。" "description": "`review`は「レビューする、確認する」という意味です。この文脈では、書類を送る前に確認する必要があるという意味で使われています。" }, ... ] ```\
  上記を踏まえて \
  [ \
    {"word": "attorney","translation":"弁護士、代理人"},\
    {"word": "astronaut","translation":"宇宙飛行士"}, \
    {"word": "create","translation":"作る, 生み出す, 引き起こす"} \
  ] \
  が答えとなる問題を１つずつ考えてほしい';

  try {
    const result = await model.generateContent(prompt);
    if (result.response.candidates) {
      const responseJson = result.response.candidates[0].content.parts[0].text ?? ""
      console.log(responseJson)
      const response = JSON.parse(responseJson)
      return QuestionListSchema.parse(response)
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
