import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ProgressBar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { trpc } from "../../../trpc";

const SentenceQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());

  const router = useRouter();

  const { data, isLoading, error } = trpc.getQuestions.useQuery(["a", "a"]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (
      data !== undefined &&
      answer === data[currentQuestionIndex].correctAnswer.word
    ) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleFinish = () => {
    router.dismiss();
  };

  const handleAddToVocabulary = (word: string) => {
    if (!addedWords.has(word)) {
      setAddedWords(new Set([...addedWords, word]));
    }
  };

  const handleIDontKnow = () => {
    setShowResult(true);
  };

  const currentQuestion = useMemo(() => {
    if (data !== undefined) {
      return data[currentQuestionIndex];
    }
  }, [currentQuestionIndex, data]);

  const isLastQuestion = useMemo(() => {
    if (data !== undefined) {
      return currentQuestionIndex === data.length - 1;
    } else return false;
  }, [currentQuestionIndex, data]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {data !== undefined && currentQuestion !== undefined ? (
            <View>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>例文問題</Text>
                <Text style={styles.headerSubtitle}>
                  {currentQuestionIndex + 1} / {data.length}問目
                </Text>
              </View>

              {/* プログレスバー */}
              <ProgressBar
                progress={currentQuestionIndex / data.length}
                color="#6200ee"
                style={styles.progressBar}
              />

              {/* 問題カード */}
              <View style={styles.card}>
                <Text style={styles.sentence}>{currentQuestion.sentence}</Text>
                {currentQuestion.options.map((option, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.option,
                      showResult &&
                      option.word === currentQuestion.correctAnswer.word
                        ? styles.correctOption
                        : showResult && selectedAnswer === option.word
                          ? styles.incorrectOption
                          : styles.defaultOption,
                    ]}
                    disabled={showResult}
                    onPress={() => handleAnswerSelect(option.word)}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.textContainer}>
                        <Text style={styles.optionText}>{option.word}</Text>
                        {(showResult || selectedAnswer === option.word) && (
                          <Text style={styles.translationText}>
                            {option.translation}
                          </Text>
                        )}
                      </View>
                      {showResult &&
                        option.word !== currentQuestion.correctAnswer.word && (
                          <Button
                            mode="outlined"
                            compact
                            onPress={() => handleAddToVocabulary(option.word)}
                            disabled={addedWords.has(option.word)}
                            style={styles.addButton}
                          >
                            {addedWords.has(option.word)
                              ? "追加済み"
                              : "単語帳に追加"}
                          </Button>
                        )}
                    </View>
                  </TouchableOpacity>
                ))}
                {showResult && (
                  <View style={styles.resultContainer}>
                    <View style={styles.resultMessage}>
                      {selectedAnswer === currentQuestion.correctAnswer.word ? (
                        <MaterialIcons
                          name="check-circle"
                          size={24}
                          color="green"
                        />
                      ) : (
                        <MaterialIcons name="error" size={24} color="red" />
                      )}
                      <Text style={styles.resultText}>
                        {selectedAnswer === currentQuestion.correctAnswer.word
                          ? "正解です！"
                          : `不正解です。正解は "${currentQuestion.correctAnswer.word}" でした。`}
                      </Text>
                    </View>
                    <View style={styles.explanation}>
                      <Text style={styles.explanationTitle}>解説:</Text>
                      <Text style={styles.explanationText}>
                        "{currentQuestion.correctAnswer.word}" は「
                        {
                          currentQuestion.options.find(
                            (o) =>
                              o.word === currentQuestion.correctAnswer.word,
                          )?.translation
                        }
                        」という意味です。
                        この文脈では、書類を送る前に確認する必要があるという意味で使われています。
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* フッター */}
        <View style={styles.footer}>
          {!showResult ? (
            /* わからないボタン */
            <TouchableOpacity
              onPress={handleIDontKnow}
              style={[styles.fullWidthButton, styles.outlinedButton]} // Outlinedスタイルを適用
            >
              <Text style={[styles.buttonText, styles.outlinedButtonText]}>
                わからない
              </Text>
            </TouchableOpacity>
          ) : isLastQuestion ? (
            /* 問題を終了するボタン（最後の問題の場合） */
            <TouchableOpacity
              onPress={handleFinish}
              style={[styles.fullWidthButton, styles.finishButton]}
            >
              <Text style={styles.buttonText}>問題を終了する</Text>
            </TouchableOpacity>
          ) : (
            /* 次の問題へボタン */
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.fullWidthButton, styles.nextButton]}
            >
              <Text style={styles.buttonText}>次の問題へ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    marginBottom: 16,
  },
  sentence: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  defaultOption: {
    borderColor: "#ddd",
  },
  correctOption: {
    borderColor: "green",
    backgroundColor: "#e6ffe6",
  },
  incorrectOption: {
    borderColor: "red",
    backgroundColor: "#ffe6e6",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  translationText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  resultContainer: {
    marginTop: 16,
  },
  resultMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    marginLeft: 8,
  },
  explanation: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  explanationTitle: {
    fontWeight: "bold",
  },
  explanationText: {
    marginTop: 8,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  fullWidthButton: {
    backgroundColor: "#3498db", // ボタン背景色
    height: 50, // 高さを固定（タップ可能範囲を拡張）
    justifyContent: "center", // 縦方向中央揃え
    alignItems: "center", // 横方向中央揃え
    width: "100%", // 幅を親の幅全体に設定
    borderRadius: 8, // ボタンの角丸
  },
  outlinedButton: {
    backgroundColor: "transparent", // 背景を透明に設定
    borderWidth: 1, // 枠線の太さ
    borderColor: "#3498db", // 枠線の色
    borderRadius: 5, // 角の丸み（必要に応じて調整）
  },
  outlinedButtonText: {
    color: "#3498db", // 枠線と同じ色でテキストを設定
    fontSize: 16, // テキストサイズ（必要に応じて調整）
    fontWeight: "bold", // 太字（必要に応じて調整）
  },
  nextButton: {
    backgroundColor: "#3498db", // 次の問題へ: 通常のボタン色
  },
  finishButton: {
    backgroundColor: "#f1c40f", // 問題を終了する: 別の色を付ける
  },
  buttonText: {
    color: "#ffffff", // テキスト色を白に設定
    fontSize: 18, // テキストサイズ
    fontWeight: "bold", // 太字
    textAlign: "center", // 中央配置
  },
});

export default SentenceQuiz;
