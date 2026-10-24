// 教材データ：単元・解法カード・問題
// 文章中の数式は $...$（KaTeX）。String.raw でバックスラッシュをそのまま書く。
// 問題の type:
//   num   … 数値（式で答えてよい：14/3, e^2, pi/4 など）
//   expr  … 文字を含む式（vars の範囲で乱数代入して同値判定）
//   nums  … 数の組（カンマ区切り、順不同）
//   choice… 選択式（choices[0] が正解。表示時にシャッフル）
//   sketch… グラフの概形を予想して描き、重ねて自己評価
// level: 1 基礎 / 2 標準 / 3 難関 / 4 最難関

const T = String.raw;

export const UNITS = [
  { id: 'm2d', name: '数II 微分' },
  { id: 'm2i', name: '数II 積分' },
  { id: 'm3l', name: '数III 極限' },
  { id: 'm3d', name: '数III 微分' },
  { id: 'm3i', name: '数III 積分' },
];

export const LEVELS = { 1: '基礎', 2: '標準', 3: '難関', 4: '最難関' };

// order：新しいカードを導入する順
export const CARDS = [
  {
    id: 'tangent', unit: 'm2d', name: '接線の方程式', pre: [],
    point: T`曲線 $y=f(x)$ 上の点 $(a,\,f(a))$ における接線は $y-f(a)=f'(a)(x-a)$。曲線の外の点から引く接線は、**接点を文字でおいて**から通る条件を書く。`,
    example: T`$y=x^2$ の $x=1$ における接線：$y'=2x$ より傾きは $2$。$y-1=2(x-1)$ すなわち $y=2x-1$。`,
    graph: ['y=x^2', 'y=2x-1', '(1,1)'],
  },
  {
    id: 'area', unit: 'm2i', name: '定積分と面積', pre: [],
    point: T`区間 $a\le x\le b$ で $f(x)\ge g(x)$ のとき、2曲線で囲まれた部分の面積は $\displaystyle\int_a^b\{f(x)-g(x)\}\,dx$（上 − 下）。$x$ 軸より下にある部分は符号に注意。`,
    example: T`$y=x^2$ と $x$ 軸、直線 $x=1$ で囲まれた面積：$\displaystyle\int_0^1x^2\,dx=\frac13$。`,
    graph: ['y=x^2', '0<=y<=x^2', 'x=1'],
  },
  {
    id: 'diffrules', unit: 'm3d', name: '積・商・合成関数の微分', pre: ['tangent'],
    point: T`積 $(fg)'=f'g+fg'$、商 $\left(\dfrac fg\right)'=\dfrac{f'g-fg'}{g^2}$、合成 $\{f(g(x))\}'=f'(g(x))\,g'(x)$。`,
    example: T`$(\sin 2x)'=2\cos 2x$、$\left(e^{x^2}\right)'=2xe^{x^2}$。`,
  },
  {
    id: 'extrema', unit: 'm2d', name: '増減と極値', pre: ['tangent'],
    point: T`極値をとるのは、$f'(x)=0$ となる点のうち **$f'(x)$ の符号が変わる点**。増減表で確かめる。重解では符号が変わらないことがある。`,
    example: T`$f(x)=x^3-3x$：$f'(x)=3(x+1)(x-1)$。$x=-1$ で極大値 $2$、$x=1$ で極小値 $-2$。`,
    graph: ['y=x^3-3x'],
  },
  {
    id: 'elim', unit: 'm3l', name: '自然対数の底 e の極限', pre: [],
    point: T`$\displaystyle\lim_{h\to0}(1+h)^{\frac1h}=e$。$\left(1+\frac an\right)^n$ などは、$h$ を作ってこの形に持ち込む。`,
    example: T`$\displaystyle\lim_{n\to\infty}\left(1+\frac1n\right)^{3n}=\lim\left\{\left(1+\frac1n\right)^n\right\}^3=e^3$。`,
  },
  {
    id: 'squeeze', unit: 'm3l', name: 'はさみうちの原理', pre: [],
    point: T`直接求めにくい極限は、$a_n\le b_n\le c_n$ かつ $a_n,\,c_n\to\alpha$ となる不等式を作って、$b_n\to\alpha$ を示す。`,
    example: T`$-\dfrac1n\le\dfrac{\cos n}{n}\le\dfrac1n$ で両端 $\to0$ なので $\displaystyle\lim_{n\to\infty}\frac{\cos n}{n}=0$。`,
    graph: ['y=cos(x)/x', 'y=1/x', 'y=-1/x'],
  },
  {
    id: 'sixth', unit: 'm2i', name: '1/6公式', pre: ['area'],
    point: T`$\displaystyle\int_\alpha^\beta(x-\alpha)(x-\beta)\,dx=-\frac{(\beta-\alpha)^3}{6}$。放物線（$x^2$ の係数 $a$）と直線で囲まれた面積は $\dfrac{|a|}{6}(\beta-\alpha)^3$。`,
    example: T`$y=x^2$ と $y=1$：交点 $x=\pm1$ より $S=\dfrac{2^3}{6}=\dfrac43$。`,
    graph: ['y=x^2', 'x^2<=y<=1'],
  },
  {
    id: 'maxmin', unit: 'm2d', name: '区間における最大・最小', pre: ['extrema'],
    point: T`閉区間での最大・最小は「極値」と「端点の値」を比べて決める。文字を含むときは、極値をとる点が区間の内か外かで場合分けする。`,
    example: T`$f(x)=x^2-2x\ (0\le x\le3)$：$x=1$ で最小値 $-1$、端点 $x=3$ で最大値 $3$。`,
    graph: ['y=x^2-2x', 'x=0', 'x=3'],
  },
  {
    id: 'subst', unit: 'm3i', name: '置換積分', pre: ['diffrules'],
    point: T`被積分関数に「ある関数 $g(x)$ とその導関数 $g'(x)$」の組が見えたら $u=g(x)$ と置換する。積分区間も $u$ の範囲に変える。`,
    example: T`$\displaystyle\int_0^1 2xe^{x^2}dx$：$u=x^2$ で $\displaystyle\int_0^1e^u\,du=e-1$。`,
  },
  {
    id: 'parts', unit: 'm3i', name: '部分積分', pre: ['diffrules'],
    point: T`$\displaystyle\int f'g\,dx=fg-\int fg'\,dx$。微分すると簡単になるもの（多項式、$\log x$）を $g$ に選ぶ。`,
    example: T`$\displaystyle\int_0^1xe^x\,dx=\big[xe^x\big]_0^1-\int_0^1e^x\,dx=e-(e-1)=1$。`,
  },
  {
    id: 'shape', unit: 'm3d', name: 'グラフの概形', pre: ['diffrules', 'extrema'],
    point: T`概形は ①定義域・対称性 ②$y'$ で増減 ③$y''$ で凹凸と変曲点 ④$x\to\pm\infty$ や定義されない点の近くでの振る舞い（漸近線）の順に調べる。`,
    example: T`$y=e^{-x^2}$：偶関数。$x=0$ で最大値 $1$。$y''=(4x^2-2)e^{-x^2}$ より $x=\pm\frac{1}{\sqrt2}$ で変曲点。$x\to\pm\infty$ で $y\to0$。`,
    graph: ['y=e^(-x^2)'],
  },
  {
    id: 'ineq', unit: 'm3d', name: '微分による不等式の証明', pre: ['diffrules'],
    point: T`$f(x)>g(x)$ を示すには $h(x)=f(x)-g(x)$ とおき、$h$ の最小値が正であることを示す。$h'$ の符号がわからなければ、さらに微分する。`,
    example: T`$x>0$ で $e^x>1+x$：$h(x)=e^x-1-x$ とおくと $h'(x)=e^x-1>0$、$h(0)=0$ より $h(x)>0$。`,
    graph: ['y=e^x', 'y=1+x'],
  },
  {
    id: 'riemann', unit: 'm3i', name: '区分求積法', pre: ['area'],
    point: T`$\displaystyle\lim_{n\to\infty}\frac1n\sum_{k=1}^{n}f\!\left(\frac kn\right)=\int_0^1f(x)\,dx$。和を「$\frac1n\times\left(\frac kn\text{ の式}\right)$」の形に変形する。`,
    example: T`$\displaystyle\lim_{n\to\infty}\frac1n\sum_{k=1}^n\left(\frac kn\right)^2=\int_0^1x^2\,dx=\frac13$。`,
  },
  {
    id: 'volume', unit: 'm3i', name: '回転体の体積', pre: ['subst', 'area'],
    point: T`$x$ 軸のまわりの回転体の体積は $V=\pi\displaystyle\int_a^b\{f(x)\}^2dx$。2曲線の間の部分は $\pi\displaystyle\int(f^2-g^2)\,dx$ であり、$\pi\displaystyle\int(f-g)^2dx$ ではない。`,
    example: T`$y=\sqrt x\ (0\le x\le1)$ を回転：$V=\pi\displaystyle\int_0^1x\,dx=\frac\pi2$。`,
    graph: ['y=sqrt(x)', '0<=y<=sqrt(x)', 'x=1'],
  },
  {
    id: 'sep', unit: 'm3d', name: '定数分離とグラフの交点', pre: ['shape'],
    point: T`文字定数 $a$ を含む方程式・不等式は、$a$ を片側に分離して $g(x)=a$ の形にし、曲線 $y=g(x)$ と直線 $y=a$ の位置関係で考える。`,
    example: T`$x^2-2x=a$ が実数解をもつ条件：$y=x^2-2x$ の最小値は $-1$ なので $a\ge-1$。`,
    graph: ['y=x^2-2x', 'y=a', 'a=1'],
  },
];

export const PROBLEMS = [
  // ---------- 数II 微分 ----------
  {
    id: 'p01', cards: ['tangent'], level: 1, type: 'expr', vars: { x: [-3, 3] },
    q: T`曲線 $y=x^3-3x$ 上の点 $(2,\,2)$ における接線の方程式を $y=\square$ の形で答えよ。`,
    ans: '9x-16', prefix: 'y =',
    hints: [T`接線の傾きは何で決まるだろうか。`, T`$y'=3x^2-3$ に $x=2$ を代入すると傾きが出る。`, T`傾き $9$ で点 $(2,2)$ を通る直線：$y-2=9(x-2)$。`],
    sol: T`$y'=3x^2-3$ より $x=2$ での傾きは $9$。よって $y-2=9(x-2)$、すなわち $y=9x-16$。`,
    graph: ['y=x^3-3x', 'y=9x-16', '(2,2)'],
  },
  {
    id: 'p02', cards: ['tangent'], level: 2, type: 'nums',
    q: T`点 $(1,\,-3)$ から放物線 $y=x^2$ に引いた接線の傾きをすべて求めよ（カンマ区切り）。`,
    ans: '-2, 6',
    hints: [T`点 $(1,-3)$ は放物線上にない。接点を文字でおこう。`, T`接点 $(a,\,a^2)$ における接線 $y=2ax-a^2$ が点 $(1,-3)$ を通る条件を書く。`, T`$a^2-2a-3=0$ より $a=3,\,-1$。傾きは $2a$。`],
    sol: T`接点を $(a,\,a^2)$ とすると接線は $y=2ax-a^2$。これが $(1,-3)$ を通るので $-3=2a-a^2$、$a^2-2a-3=0$、$a=-1,\,3$。傾きは $2a=-2,\ 6$。`,
    graph: ['y=x^2', 'y=-2x-1', 'y=6x-9', '(1,-3)'],
  },
  {
    id: 'p03', cards: ['extrema'], level: 2, type: 'num',
    q: T`関数 $f(x)=x^3-6x^2+9x+1$ の極大値を求めよ。`,
    ans: '5',
    hints: [T`極値の候補は $f'(x)=0$ となる点。`, T`$f'(x)=3(x-1)(x-3)$。符号の変化を増減表で確かめよう。`, T`$x=1$ の前後で $f'(x)$ は正から負に変わる。`],
    sol: T`$f'(x)=3x^2-12x+9=3(x-1)(x-3)$。$x=1$ で極大となり、極大値は $f(1)=1-6+9+1=5$。（$x=3$ で極小値 $1$）`,
    graph: ['y=x^3-6x^2+9x+1'],
  },
  {
    id: 'p04', cards: ['extrema'], level: 2, type: 'choice',
    q: T`$f(x)=x^3+ax^2+3x$ が極値をもつような定数 $a$ の値の範囲は？`,
    choices: [T`$a<-3$ または $a>3$`, T`$-3<a<3$`, T`$a\le-3$ または $a\ge3$`, T`$a>3$`],
    hints: [T`3次関数が極値をもつのは、$f'(x)$ の符号が変わる点があるとき。`, T`$f'(x)=3x^2+2ax+3=0$ が異なる2つの実数解をもてばよい。`, T`判別式 $D/4=a^2-9>0$。重解（$D=0$）では符号が変わらない。`],
    sol: T`$f'(x)=3x^2+2ax+3$。極値をもつ $\iff$ $f'(x)=0$ が異なる2実解をもつ $\iff$ $a^2-9>0$。よって $a<-3,\ 3<a$。$a=\pm3$ のときは $f'(x)\ge0$ で単調増加となり、極値をもたない。`,
    graph: ['y=x^3+ax^2+3x', 'a=4'],
  },
  {
    id: 'p05', cards: ['maxmin'], level: 2, type: 'num',
    q: T`$f(x)=x^3-3x\ \ (-2\le x\le3)$ の最大値を求めよ。`,
    ans: '18',
    hints: [T`区間での最大値の候補は「極値」と「端点の値」。`, T`極大は $x=-1$ で $f(-1)=2$。端点も調べよう。`, T`$f(3)=27-9=18$ と比べる。`],
    sol: T`$f'(x)=3(x+1)(x-1)$。候補は $f(-2)=-2,\ f(-1)=2,\ f(1)=-2,\ f(3)=18$。最大値は $18$（$x=3$）。`,
    graph: ['y=x^3-3x', 'x=-2', 'x=3'],
  },
  {
    id: 'p06', cards: ['maxmin'], level: 3, type: 'expr', vars: { a: [0.1, 4] },
    q: T`$0<a\le4$ とする。$f(x)=x^3-3ax\ \ (0\le x\le2)$ の最小値を $a$ の式で答えよ。`,
    ans: '-2a*sqrt(a)',
    hints: [T`$f'(x)=3(x^2-a)$。極小となる $x$ はどこか。`, T`$x=\sqrt a$ で極小。$0<a\le4$ なら $\sqrt a$ は区間 $[0,2]$ の中にある。`, T`$f(\sqrt a)=a\sqrt a-3a\sqrt a$ を計算。`],
    sol: T`$f'(x)=3(x-\sqrt a)(x+\sqrt a)$。$0\le x\le2$ では $x=\sqrt a\ (\le2)$ で減少から増加に変わるので、ここで最小。最小値は $f(\sqrt a)=-2a\sqrt a$。（$a>4$ なら最小値は $f(2)=8-6a$ となり、場合分けが必要）`,
    graph: ['y=x^3-3ax', 'a=1', 'x=2'],
  },
  // ---------- 数II 積分 ----------
  {
    id: 'p07', cards: ['area'], level: 1, type: 'num',
    q: T`$\displaystyle\int_0^2(x^2-2x+3)\,dx$ を求めよ。`,
    ans: '14/3',
    hints: [T`原始関数を求めてから、上端・下端を代入する。`, T`原始関数は $\dfrac{x^3}{3}-x^2+3x$。`, T`$\dfrac83-4+6$ を計算。`],
    sol: T`$\left[\dfrac{x^3}{3}-x^2+3x\right]_0^2=\dfrac83-4+6=\dfrac{14}{3}$。`,
    graph: ['y=x^2-2x+3', '0<=y<=x^2-2x+3', 'x=2'],
  },
  {
    id: 'p30', cards: ['area', 'sixth'], level: 2, type: 'num',
    q: T`放物線 $y=x^2-4x$ と $x$ 軸で囲まれた部分の面積を求めよ。`,
    ans: '32/3',
    hints: [T`グラフが $x$ 軸より下にある区間では、面積は $-\displaystyle\int y\,dx$。`, T`$x$ 軸との交点は $x=0,\,4$。`, T`1/6公式：$\dfrac{(4-0)^3}{6}$。`],
    sol: T`$S=-\displaystyle\int_0^4(x^2-4x)\,dx=\dfrac{(4-0)^3}{6}=\dfrac{32}{3}$。`,
    graph: ['y=x^2-4x', 'x^2-4x<=y<=0'],
  },
  {
    id: 'p08', cards: ['sixth'], level: 2, type: 'num',
    q: T`放物線 $y=x^2$ と直線 $y=x+2$ で囲まれた部分の面積を求めよ。`,
    ans: '9/2',
    hints: [T`まず交点の $x$ 座標を求める。`, T`$x^2=x+2$ より $x=-1,\,2$。`, T`$\displaystyle\int_\alpha^\beta(x-\alpha)(x-\beta)\,dx=-\frac{(\beta-\alpha)^3}{6}$ が使える。`],
    sol: T`交点は $x=-1,\,2$。$S=\displaystyle\int_{-1}^{2}\{(x+2)-x^2\}\,dx=\frac{\{2-(-1)\}^3}{6}=\frac{27}{6}=\frac92$。`,
    graph: ['y=x^2', 'y=x+2', 'x^2<=y<=x+2'],
  },
  {
    id: 'p09', cards: ['sixth'], level: 3, type: 'num',
    q: T`放物線 $y=x^2$ と直線 $y=mx+1$ で囲まれた部分の面積 $S$ の最小値を求めよ。`,
    ans: '4/3',
    hints: [T`交点の $x$ 座標を $\alpha<\beta$ とおくと $S=\dfrac{(\beta-\alpha)^3}{6}$。`, T`解と係数の関係から $(\beta-\alpha)^2=(\alpha+\beta)^2-4\alpha\beta=m^2+4$。`, T`$S=\dfrac{(m^2+4)^{3/2}}{6}$ は $m=0$ で最小。`],
    sol: T`$x^2-mx-1=0$ の2解を $\alpha<\beta$ とすると $(\beta-\alpha)^2=m^2+4$。$S=\dfrac{(\beta-\alpha)^3}{6}=\dfrac{(m^2+4)^{3/2}}{6}\ge\dfrac{8}{6}=\dfrac43$（等号は $m=0$）。`,
    graph: ['y=x^2', 'y=mx+1', 'm=1', 'x^2<=y<=mx+1'],
  },
  // ---------- 数III 極限 ----------
  {
    id: 'p10', cards: ['elim'], level: 2, type: 'num',
    q: T`$\displaystyle\lim_{n\to\infty}\left(1+\frac2n\right)^n$ を求めよ。`,
    ans: 'e^2',
    hints: [T`$\displaystyle\lim_{h\to0}(1+h)^{\frac1h}=e$ の形を作れないか。`, T`$\dfrac2n=h$ とおくと $n=\dfrac2h$。`, T`$(1+h)^{\frac2h}=\left\{(1+h)^{\frac1h}\right\}^2$。`],
    sol: T`$h=\dfrac2n$ とおくと、$n\to\infty$ のとき $h\to+0$。$(1+h)^{\frac2h}=\left\{(1+h)^{\frac1h}\right\}^2\to e^2$。`,
  },
  {
    id: 'p31', cards: ['elim'], level: 2, type: 'num',
    q: T`$\displaystyle\lim_{x\to0}\frac{\log(1+x)}{x}$ を求めよ。`,
    ans: '1',
    hints: [T`$\dfrac1x\log(1+x)$ と見て、対数の性質を使う。`, T`$\dfrac1x\log(1+x)=\log(1+x)^{\frac1x}$。`, T`$(1+x)^{\frac1x}\to e$ で、$\log e=1$。`],
    sol: T`$\dfrac{\log(1+x)}{x}=\log(1+x)^{\frac1x}\to\log e=1$。`,
    graph: ['y=log(1+x)/x'],
  },
  {
    id: 'p11', cards: ['squeeze'], level: 3, type: 'num',
    q: T`$\displaystyle\lim_{n\to\infty}(3^n+5^n)^{\frac1n}$ を求めよ。`,
    ans: '5',
    hints: [T`大きい方の項 $5^n$ に注目しよう。`, T`$5^n<3^n+5^n<2\cdot5^n$。`, T`各辺を $\frac1n$ 乗し、$2^{\frac1n}\to1$ を使う（はさみうち）。`],
    sol: T`$5^n<3^n+5^n<2\cdot5^n$ より $5<(3^n+5^n)^{\frac1n}<5\cdot2^{\frac1n}$。$2^{\frac1n}\to1$ なので、はさみうちの原理より極限は $5$。`,
  },
  {
    id: 'p32', cards: ['squeeze'], level: 2, type: 'num',
    q: T`$\displaystyle\lim_{x\to\infty}\frac{\sin x}{x}$ を求めよ。`,
    ans: '0',
    hints: [T`$\sin x$ はどんな範囲の値をとるか。`, T`$-1\le\sin x\le1$ の各辺を $x\ (>0)$ で割る。`, T`$\pm\dfrac1x\to0$ ではさむ。`],
    sol: T`$x>0$ で $-\dfrac1x\le\dfrac{\sin x}{x}\le\dfrac1x$。両端が $0$ に収束するので、極限は $0$。`,
    graph: ['y=sin(x)/x', 'y=1/x', 'y=-1/x'],
  },
  // ---------- 数III 微分 ----------
  {
    id: 'p12', cards: ['diffrules'], level: 1, type: 'expr', vars: { x: [-2, 2] },
    q: T`$\left(x^2e^x\right)'$ を求めよ。`,
    ans: '(x^2+2x)e^x',
    hints: [T`積の微分 $(fg)'=f'g+fg'$。`, T`$(x^2)'=2x,\ (e^x)'=e^x$。`, T`$2xe^x+x^2e^x$ を整理。`],
    sol: T`$\left(x^2e^x\right)'=2xe^x+x^2e^x=(x^2+2x)e^x$。`,
  },
  {
    id: 'p13', cards: ['diffrules'], level: 1, type: 'expr', vars: { x: [-3, 3] },
    q: T`$\left\{\log(x^2+1)\right\}'$ を求めよ。`,
    ans: '2x/(x^2+1)',
    hints: [T`合成関数の微分：外側が $\log u$、内側が $u=x^2+1$。`, T`$(\log u)'=\dfrac{u'}{u}$。`, T`$u'=2x$。`],
    sol: T`$\left\{\log(x^2+1)\right\}'=\dfrac{(x^2+1)'}{x^2+1}=\dfrac{2x}{x^2+1}$。`,
  },
  {
    id: 'p14', cards: ['diffrules'], level: 2, type: 'expr', vars: { x: [-3, 3] },
    q: T`$\left(\sin^3x\right)'$ を求めよ。`,
    ans: '3sin(x)^2cos(x)',
    hints: [T`$\sin^3x=(\sin x)^3$ とみる。`, T`$(u^3)'=3u^2u'$。`, T`$u=\sin x$ なら $u'=\cos x$。`],
    sol: T`$\left(\sin^3x\right)'=3\sin^2x\cdot(\sin x)'=3\sin^2x\cos x$。`,
  },
  {
    id: 'p15', cards: ['shape'], level: 3, type: 'num',
    q: T`曲線 $y=xe^{-x}$ の変曲点の $x$ 座標を求めよ。`,
    ans: '2',
    hints: [T`変曲点は $y''$ の符号が変わる点。`, T`$y'=(1-x)e^{-x}$。`, T`$y''=(x-2)e^{-x}$。`],
    sol: T`$y'=(1-x)e^{-x}$、$y''=(x-2)e^{-x}$。$x=2$ の前後で $y''$ の符号が変わるので、変曲点の $x$ 座標は $2$（点 $(2,\,2e^{-2})$）。`,
    graph: ['y=xe^(-x)', '(2, 2e^(-2))'],
  },
  {
    id: 'p16', cards: ['shape'], level: 2, type: 'expr', vars: { x: [-3, 3] },
    q: T`曲線 $y=\dfrac{x^2+1}{x}$ の、$y$ 軸に平行でない漸近線を $y=\square$ の形で答えよ。`,
    ans: 'x', prefix: 'y =',
    hints: [T`分子を分母で割ってみよう。`, T`$\dfrac{x^2+1}{x}=x+\dfrac1x$。`, T`$x\to\pm\infty$ で $\dfrac1x\to0$。`],
    sol: T`$y=x+\dfrac1x$ で、$x\to\pm\infty$ のとき $y-x=\dfrac1x\to0$。漸近線は $y=x$（ほかに $x=0$）。`,
    graph: ['y=(x^2+1)/x', 'y=x'],
  },
  {
    id: 'p28', cards: ['shape'], level: 3, type: 'sketch',
    q: T`$y=x^2e^{-x}$ のグラフの概形を予想して、下に指で描いてみよう。描けたら「答え合わせ」。`,
    graph: ['y=x^2e^(-x)'], view: { xmin: -2, xmax: 8, ymin: -1, ymax: 3 },
    hints: [T`$y\ge0$ であることに注目。`, T`$y'=x(2-x)e^{-x}$ で増減を調べる。`, T`$x\to\infty$ では $e^{-x}$ が勝って $0$ に近づく。`],
    sol: T`$y'=x(2-x)e^{-x}$ より、$x=0$ で極小値 $0$、$x=2$ で極大値 $4e^{-2}\approx0.54$。$x\to\infty$ で $y\to0$（$x$ 軸が漸近線）、$x\to-\infty$ で $y\to\infty$。`,
  },
  {
    id: 'p29', cards: ['shape'], level: 3, type: 'sketch',
    q: T`$y=\dfrac{\log x}{x}$ のグラフの概形を予想して描いてみよう。`,
    graph: ['y=log(x)/x'], view: { xmin: -0.5, xmax: 10, ymin: -2, ymax: 1 },
    hints: [T`定義域はどこか。`, T`$y'=\dfrac{1-\log x}{x^2}$。`, T`$x\to+0$ と $x\to\infty$ での振る舞いを確認。`],
    sol: T`定義域は $x>0$。$y'=\dfrac{1-\log x}{x^2}$ より $x=e$ で極大値 $\dfrac1e$。$x\to+0$ で $y\to-\infty$、$x\to\infty$ で $y\to0$。$y''=\dfrac{2\log x-3}{x^3}$ より $x=e^{\frac32}$ で変曲点。`,
  },
  {
    id: 'p17', cards: ['ineq'], level: 3, type: 'choice',
    q: T`$x>0$ のとき $e^x>1+x+\dfrac{x^2}{2}$ を示したい。最も確実な方針は？`,
    choices: [
      T`$f(x)=e^x-\left(1+x+\frac{x^2}{2}\right)$ とおき、$f'(x)$、$f''(x)$ の符号から $f(x)>0$ を示す`,
      T`両辺の自然対数をとって比較する`,
      T`$x=1,\,2,\,3$ を代入して成り立つことを確かめる`,
      T`両辺を $x^2$ で割り、$x\to\infty$ の極限を比べる`,
    ],
    hints: [T`「$A>B$」を示すには $A-B>0$ を示すのが基本。`, T`差の関数 $f(x)$ について $f(0)$ はいくつか。`, T`$f(0)=0$ で、$f$ が $x>0$ で増加なら $f(x)>0$。$f'$ の符号がわからなければさらに微分する。`],
    sol: T`$f(x)=e^x-1-x-\dfrac{x^2}{2}$ とすると $f'(x)=e^x-1-x$、$f''(x)=e^x-1>0\ (x>0)$。$f'(0)=0$ より $x>0$ で $f'(x)>0$。$f(0)=0$ より $f(x)>0$。代入や極限では「すべての $x>0$」を示せない。`,
    graph: ['y=e^x', 'y=1+x+x^2/2'],
  },
  {
    id: 'p18', cards: ['sep', 'ineq'], level: 4, type: 'num',
    q: T`すべての正の実数 $x$ に対して $\log x\le ax$ が成り立つような定数 $a$ の最小値を求めよ。`,
    ans: '1/e',
    hints: [T`$a$ を分離：$\dfrac{\log x}{x}\le a$ がすべての $x>0$ で成り立つ条件にする。`, T`$g(x)=\dfrac{\log x}{x}$ の最大値を求めればよい。`, T`$g'(x)=\dfrac{1-\log x}{x^2}$ で、$x=e$ のとき最大値 $\dfrac1e$。`],
    sol: T`$x>0$ なので $\log x\le ax\iff\dfrac{\log x}{x}\le a$。$g(x)=\dfrac{\log x}{x}$ は $g'(x)=\dfrac{1-\log x}{x^2}$ より $x=e$ で最大値 $\dfrac1e$。よって $a\ge\dfrac1e$ で、最小値は $\dfrac1e$。`,
    graph: ['y=log(x)/x', 'y=a', 'a=0.5'],
  },
  {
    id: 'p26', cards: ['sep'], level: 3, type: 'choice',
    q: T`方程式 $x^3-3x-a=0$ が異なる3つの実数解をもつような定数 $a$ の値の範囲は？`,
    choices: [T`$-2<a<2$`, T`$-2\le a\le2$`, T`$a<-2$ または $a>2$`, T`$0<a<2$`],
    hints: [T`$a$ を右辺に分離：$x^3-3x=a$。`, T`曲線 $y=x^3-3x$ と直線 $y=a$ の共有点の個数を考える。`, T`$y=x^3-3x$ の極大値は $2$、極小値は $-2$。`],
    sol: T`実数解の個数は $y=x^3-3x$ と $y=a$ の共有点の個数に等しい。極大値 $2\ (x=-1)$、極小値 $-2\ (x=1)$ なので、3個となるのは $-2<a<2$。$a=\pm2$ では接して2個。`,
    graph: ['y=x^3-3x', 'y=a', 'a=1'],
  },
  {
    id: 'p27', cards: ['sep'], level: 4, type: 'choice',
    q: T`方程式 $e^x=kx$ がちょうど2つの実数解をもつような実数 $k$ の値の範囲は？`,
    choices: [T`$k>e$`, T`$k>1$`, T`$0<k<e$`, T`$k<0$ または $k>e$`],
    hints: [T`$x=0$ は解でないので、$\dfrac{e^x}{x}=k$ と分離できる。`, T`$g(x)=\dfrac{e^x}{x}$ のグラフを $x>0$ と $x<0$ に分けて描く。`, T`$x>0$ では最小値 $g(1)=e$。$x<0$ では $g$ は負で単調減少。`],
    sol: T`$g(x)=\dfrac{e^x}{x}$、$g'(x)=\dfrac{(x-1)e^x}{x^2}$。$x<0$ では $g(x)<0$ で単調減少（値域 $(-\infty,0)$）。$x>0$ では $x=1$ で最小値 $e$ をとり、両端で $+\infty$。$y=k$ との共有点がちょうど2個 $\iff k>e$（$k<0$ と $k=e$ では1個）。`,
    graph: ['y=e^x/x', 'y=k', 'k=3'],
  },
  // ---------- 数III 積分 ----------
  {
    id: 'p19', cards: ['subst'], level: 2, type: 'num',
    q: T`$\displaystyle\int_0^1x(x^2+1)^3\,dx$ を求めよ。`,
    ans: '15/8',
    hints: [T`$x^2+1$ を微分すると $2x$ になることに注目。`, T`$u=x^2+1$ とおくと $du=2x\,dx$、$x:0\to1$ で $u:1\to2$。`, T`$\dfrac12\displaystyle\int_1^2u^3\,du$。`],
    sol: T`$u=x^2+1$ とおくと $\dfrac12\displaystyle\int_1^2u^3\,du=\frac12\left[\frac{u^4}{4}\right]_1^2=\frac12\cdot\frac{15}{4}=\frac{15}{8}$。`,
  },
  {
    id: 'p20', cards: ['subst'], level: 2, type: 'num',
    q: T`$\displaystyle\int_0^{\frac\pi2}\sin^2x\cos x\,dx$ を求めよ。`,
    ans: '1/3',
    hints: [T`$\cos x$ は $\sin x$ の導関数。`, T`$u=\sin x$ とおく。`, T`$\displaystyle\int_0^1u^2\,du$。`],
    sol: T`$u=\sin x$ とおくと $\displaystyle\int_0^1u^2\,du=\left[\frac{u^3}{3}\right]_0^1=\frac13$。`,
  },
  {
    id: 'p21', cards: ['parts'], level: 2, type: 'num',
    q: T`$\displaystyle\int_1^e\log x\,dx$ を求めよ。`,
    ans: '1',
    hints: [T`$\log x=1\cdot\log x$ とみて部分積分。`, T`$\displaystyle\int\log x\,dx=x\log x-\int x\cdot\frac1x\,dx$。`, T`原始関数は $x\log x-x$。`],
    sol: T`$\big[x\log x-x\big]_1^e=(e-e)-(0-1)=1$。`,
    graph: ['y=log(x)', '0<=y<=log(x)', 'x=e'],
  },
  {
    id: 'p22', cards: ['parts'], level: 2, type: 'num',
    q: T`$\displaystyle\int_0^\pi x\sin x\,dx$ を求めよ。`,
    ans: 'pi',
    hints: [T`多項式 × 三角関数は、多項式を微分する側にして部分積分。`, T`$\displaystyle\int x\sin x\,dx=-x\cos x+\int\cos x\,dx$。`, T`原始関数は $-x\cos x+\sin x$。`],
    sol: T`$\big[-x\cos x+\sin x\big]_0^\pi=\pi$。`,
  },
  {
    id: 'p25', cards: ['riemann'], level: 3, type: 'num',
    q: T`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\frac{n}{n^2+k^2}$ を求めよ。`,
    ans: 'pi/4',
    hints: [T`$\dfrac1n\displaystyle\sum f\!\left(\frac kn\right)$ の形を作る。`, T`$\dfrac{n}{n^2+k^2}=\dfrac1n\cdot\dfrac{1}{1+\left(\frac kn\right)^2}$。`, T`$\displaystyle\int_0^1\frac{dx}{1+x^2}$ は $x=\tan\theta$ で置換。`],
    sol: T`$\dfrac1n\displaystyle\sum_{k=1}^n\frac{1}{1+(k/n)^2}\to\int_0^1\frac{dx}{1+x^2}$。$x=\tan\theta$ とおくと $dx=\dfrac{d\theta}{\cos^2\theta}$ で、$\displaystyle\int_0^{\frac\pi4}d\theta=\frac\pi4$。`,
    graph: ['y=1/(1+x^2)', '0<=y<=1/(1+x^2)', 'x=1'],
  },
  {
    id: 'p23', cards: ['volume'], level: 2, type: 'num',
    q: T`曲線 $y=\sin x\ (0\le x\le\pi)$ と $x$ 軸で囲まれた部分を、$x$ 軸のまわりに1回転してできる立体の体積を求めよ。`,
    ans: 'pi^2/2',
    hints: [T`$V=\pi\displaystyle\int_a^b y^2\,dx$。`, T`$\sin^2x=\dfrac{1-\cos2x}{2}$ で次数を下げる。`, T`$\pi\displaystyle\int_0^\pi\frac{1-\cos2x}{2}\,dx$。`],
    sol: T`$V=\pi\displaystyle\int_0^\pi\sin^2x\,dx=\pi\left[\frac x2-\frac{\sin2x}{4}\right]_0^\pi=\frac{\pi^2}{2}$。`,
    graph: ['y=sin(x)', '0<=y<=sin(x)'],
  },
  {
    id: 'p24', cards: ['volume'], level: 3, type: 'num',
    q: T`曲線 $y=x^2$ と直線 $y=x$ で囲まれた部分を、$x$ 軸のまわりに1回転してできる立体の体積を求めよ。`,
    ans: '2pi/15',
    hints: [T`回転体は「外側の円板」から「内側の円板」をくり抜いた形。`, T`$0\le x\le1$ では $x\ge x^2$。`, T`$V=\pi\displaystyle\int_0^1(x^2-x^4)\,dx$。`],
    sol: T`$V=\pi\displaystyle\int_0^1\{x^2-(x^2)^2\}\,dx=\pi\left(\frac13-\frac15\right)=\frac{2\pi}{15}$。よくある誤り：$\pi\displaystyle\int_0^1(x-x^2)^2dx$ としてしまう。`,
    graph: ['y=x^2', 'y=x', 'x^2<=y<=x'],
  },
];

export const cardById = Object.fromEntries(CARDS.map(c => [c.id, c]));
export const problemById = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
export const unitById = Object.fromEntries(UNITS.map(u => [u.id, u]));
export function problemsFor(cardId) { return PROBLEMS.filter(p => p.cards.includes(cardId)); }
export function unitOf(p) { return cardById[p.cards[0]].unit; }
