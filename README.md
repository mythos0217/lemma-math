# Lemma 受験数学

答えを見せるのではなく、自力で解ける頭をつくる大学受験数学アプリ（試作版 v0.2）。
iPhone・iPad のブラウザで動き、ホーム画面に追加するとアプリとして使えます（PWA）。

## できること

- **今日のセット**：忘れかけた解法を、単元を混ぜて出題（交互練習）。新しい解法は「要点 → 問題」で学ぶ
- **分野を選ぶ**：科目・単元・難易度を指定して演習。未着手・久しぶりの問題を優先
- **ランダム**：数I〜数Cの全範囲から出題
- **段階ヒント**：答えは出さず、方針 → 道具 → 最初の一手の3段階
- **自信度**：答える前に「自信なし / たぶん / 確実」を選び、過信とのズレを記録
- **答えの自動判定**：`2x/(1+x^2)` と `2x/(x^2+1)` のように、書き方が違っても同じ式なら正解（乱数代入で判定）
- **予想してから描く**：グラフの概形を指で描き、本物と重ねて見比べる
- **グラフ電卓**：陽関数・陰関数・不等式の領域（連立も可）・媒介変数・極座標・点・スライダー
- **定着度マップ**：解法カードごとの「思い出せる見込み」と、自信と結果のズレ
- オフライン動作、記録の書き出し・読み込み

収録範囲：数学I・A・II・B・III・C の全19単元（解法カード45枚、問題61問）。難易度は「1対1級」（大学への数学『1対1対応の演習』程度）、「国立2次」（旧帝大2次程度）、「最難関」（東大・京大程度）の3段階。全問の答えは総当たり・数値計算で検算済み。

## GitHub Pages で公開する

1. GitHub で新しいリポジトリを作る（例：`lemma-math`、Public）
2. このフォルダの中身を**そのまま**リポジトリの直下にアップロード
   - Web から：「Add file」→「Upload files」に、フォルダの中身（`index.html` など）をまとめてドラッグ
   - ターミナルから：
     ```sh
     cd lemma
     git init && git add . && git commit -m "Lemma v0.1"
     git branch -M main
     git remote add origin https://github.com/<ユーザー名>/lemma-math.git
     git push -u origin main
     ```
3. リポジトリの「Settings」→「Pages」→ Source を「Deploy from a branch」、Branch を `main` / `/ (root)` にして Save
4. 1〜2分後に `https://<ユーザー名>.github.io/lemma-math/` で開ける
5. iPhone の Safari で開き、共有ボタン →「ホーム画面に追加」

更新したときは `sw.js` の `VERSION` を上げると、端末のキャッシュも入れ替わります。

## 問題を追加する

`js/content.js` の `PROBLEMS` に追記します。数式は `$...$`（KaTeX）。

```js
{
  id: 'q62', cards: ['sixth'], level: 2, type: 'num',
  q: String.raw`放物線 $y=x^2-1$ と $x$ 軸で囲まれた部分の面積を求めよ。`,
  ans: '4/3',
  hints: ['…', '…', '…'],
  sol: String.raw`…`,
  graph: ['y=x^2-1', 'x^2-1<=y<=0'],
},
```

| type | 答え方 | 判定 |
| --- | --- | --- |
| `num` | 数（`14/3`, `e^2`, `pi/4` も可） | 値が一致 |
| `expr` | 文字式 | `vars` の範囲で乱数を代入して一致 |
| `nums` | カンマ区切りの数 | 順不同で一致 |
| `choice` | 選択肢（`choices[0]` が正解） | 表示時にシャッフル |
| `sketch` | グラフを指で描く | 本物と重ねて自己評価 |

`cards[0]` がその問題の主な解法です。新しい解法カードは `CARDS` に追加し、`pre` に前提カードを書きます。

## 構成

```
index.html            画面の骨組み
css/style.css         見た目（ライト／ダーク対応）
js/app.js             画面と学習ループ
js/parser.js          数式パーサ、TeX変換、答えの同値判定
js/graph.js           グラフ描画エンジン（Canvas）
js/scheduler.js       復習間隔の推定（FSRSを簡略化）と出題の組み立て
js/content.js         単元・解法カード・問題
sw.js                 オフライン用キャッシュ
vendor/               KaTeX 0.16（MIT License）
```

ビルド不要。ローカルで試すときは `python3 -m http.server` を実行して `http://localhost:8000` を開きます。

## 設計の根拠

- 想起練習・分散学習：Dunlosky et al. (2013), *Psychological Science in the Public Interest*
- 交互練習：Rohrer et al. (2020), *Journal of Educational Psychology*（中1・787人の無作為化試験）
- 答えを出さないAI支援：Bastani et al. (2025), *PNAS*

難関・最難関レベルでの効果は未検証です。記録データ（書き出しJSON）を使って、自分で効果を確かめることを想定しています。
