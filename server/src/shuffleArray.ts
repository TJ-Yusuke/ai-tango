// 配列をシャッフルするための関数
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // 元の配列をコピー
  // Fisher-Yatesアルゴリズムでシャッフル
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素の交換
  }
  return newArray;
}