
export function replaceBackticksWithHTMLTags(input: string): string {
  // マッチするバッククォートのグループを見つける正規表現パターン
  const backticksPattern = /```/g;

  // 置換用のカウンター
  let replacementCounter = 0;

  // 置換用の関数
  const replaceWithTags = (): string => {
    // 奇数回目のマッチの場合は<pre><code>に、偶数回目の場合は</code></pre>に置換
    return replacementCounter++ % 2 === 0 ? '<pre><code>' : '</code></pre>';
  };

  // 文字列内のバッククォートを交互にHTMLタグに置換
  return input.replace(backticksPattern, replaceWithTags);
}

