import { VertexAI } from "@google-cloud/vertexai";
import { QuestionList, QuestionListSchema, WordsList } from "./models/question.js";
import { shuffleArray } from "./shuffleArray.js";

export async function generateContent(wordsList: WordsList): Promise<QuestionList | undefined> {
	const projectId = process.env.GCP_PROJECT_ID;
	const location = process.env.GCP_LOCATION;

	const vertexAI = new VertexAI({ project: projectId, location: location });
	const model = vertexAI.getGenerativeModel({
		model: "gemini-2.0-flash-exp",
		generationConfig: {
			responseMimeType: "application/json",
		},
	});

	const wordsListJson = JSON.stringify(wordsList);

	const prompt = `\
As an English language expert, I want you to create English questions. Based on the specific information provided below, please create the questions accordingly. \
- The format of the question should be a multiple-choice question with 4 options. \
- Each of the 4 options should be either English words, idioms, or phrases. \
- **It is absolutely not possible for all the options to have the same meaning. Moreover, when the incorrect options are substituted for the blank in the sentence, they should not create a grammatically correct or meaningful sentence.**
- If any of the incorrect options are placed in the “____” space, it must not make logical sense in the sentence. \
- If the correct answer is a single word, all other options must also be individual English words. \
- If the correct answer is an idiom, all other options must also be idioms. \
- If the correct answer is a phrase, all other options must also be phrases. \
- Each option must have a corresponding Japanese translation. \
- If the answer is a word, its corresponding Japanese translation must have at least two or more non-overlapping words. If overlaps occur, the redundant parts should be omitted. If this results in a single word, that is acceptable. \
- If the answer is an idiom or phrase, the corresponding Japanese must have one or more translations. \
- The question sentence should be an example sentence in English, with the correct answer replaced by “____”. \
- The question sentence must have a corresponding Japanese translation. \
- The question must also have a corresponding explanation in Japanese (“description”), written in a natural and clear manner. \
- Present the output in a clean, JSON format without any unnecessary whitespace or newlines, as shown in the example below: \
\`\`\`json
[
{
"sentence": "I need to _____ this document before sending it.",
"options": [
{
"word": "review",
"translation": ["レビューする", "確認する"]
},
{
"word": "contain",
"translation": ["含む", "収容する"]
},
{
"word": "mention",
"translation": ["言及する", "述べる"]
},
{
"word": "describe",
"translation": ["説明する", "描写する"]
}
],
"correctAnswer": {
"word": "review",
"translation": ["レビューする", "確認する"]
},
"translation": "送信する前にこの文書を見直す必要があります。",
"description": "\`review\`は「レビューする、確認する」という意味です。この文脈では、書類を送る前に確認する必要があるという意味で使われています。"
},
...
]
\`\`\`
Considering this format, please generate one question for each item in this list:
${wordsListJson}`;

	try {
		const result = await model.generateContent(prompt);
		console.log(result);
		if (result.response.candidates) {
			const responseJson = result.response.candidates[0].content.parts[0].text ?? "";
			console.log(responseJson);
			const response = JSON.parse(responseJson);
			const questionsList = QuestionListSchema.parse(response);

			// 選択肢をシャッフルする
			return questionsList.map((question) => {
				return { ...question, options: shuffleArray(question.options) };
			});
		}
	} catch (error) {
		console.error("Error:", error);
	}
}
