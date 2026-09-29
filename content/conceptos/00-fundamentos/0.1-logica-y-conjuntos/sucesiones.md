---
id: sucesiones
titulo: Sucesiones
titulo_en: Sequences
alias:
  - sucesión
  - límite de una sucesión
  - convergencia de sucesiones
modulo: 0
submodulo: '0.1'
orden: 17
nivel: basico
prerrequisitos:
  - funciones
etiquetas:
  - sucesiones
  - límite
  - convergencia
  - épsilon
resumen: >
  Una sucesión es una lista infinita ordenada de números, una función de los naturales en los reales. Converge
  a L si, para cualquier tolerancia, a partir de cierto índice todos sus términos quedan dentro de esa tolerancia.
formula: '\lim_{n \to \infty} a_n = L \iff \forall \varepsilon > 0\ \exists N\ \forall n \ge N:\ |a_n - L| < \varepsilon'
visualizacion:
  componente: SequenceSeries
  parametros:
    modo: sucesion
    sucesion: euler
    sucesiones:
      - euler
      - inverso
      - alternante-decreciente
      - cociente
      - seno-entre-n
      - raiz-enesima
      - oscilante
      - lineal
    epsilon: 0.1
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un banco paga un interés anual de 100 % sobre un depósito de un peso. Si lo paga una sola vez al año, al final hay 2 pesos. Si lo divide en dos pagos semestrales de 50 %, hay $1.5^2 = 2.25$. Con doce pagos mensuales hay unos 2.613, con pagos diarios unos 2.715. Cada vez que se capitaliza con más frecuencia el saldo crece, pero cada vez menos, y los valores parecen acercarse a un número fijo cercano a 2.718.

Esa lista de saldos, uno para cada número de pagos, es una sucesión. La pregunta natural es si se estabiliza en algún valor. Decir que "se acerca a 2.718" requiere precisión: significa que, para cualquier margen de error que alguien fije, por pequeño que sea, a partir de cierto número de pagos todos los saldos quedan dentro de ese margen. No basta con que algunos términos se acerquen; todos los posteriores deben permanecer cerca.

El número al que se acercan estos saldos es la constante $e$.

## Definición

Una **sucesión** de números reales es una función $a: \mathbb{N} \to \mathbb{R}$; se escribe $a_n$ en lugar de $a(n)$ y $(a_n)_{n \ge 1}$ para la sucesión completa.

:::definicion[Límite de una sucesión]
$(a_n)$ **converge** a $L \in \mathbb{R}$, y se escribe $\lim_{n \to \infty} a_n = L$ o $a_n \to L$, si
$$
\forall \varepsilon > 0\ \exists N \in \mathbb{N}\ \forall n \ge N:\ |a_n - L| < \varepsilon.
$$
Si no existe tal $L$, la sucesión **diverge**. Diverge a $+\infty$ si para todo $M$ existe $N$ con $a_n > M$ para todo $n \ge N$.
:::

$(a_n)$ es **acotada** si existe $M$ con $|a_n| \le M$ para todo $n$, y **monótona creciente** si $a_n \le a_{n+1}$ para todo $n$.

## Cómo usar la visualización

Los términos $a_n$ aparecen uno por uno como puntos. Si la sucesión converge, se dibuja la banda $L \pm \varepsilon$ y se marca el índice $N(\varepsilon)$ a partir del cual todos los términos quedan dentro. El panel muestra el término actual, el límite y la distancia $|a_n - L|$.

Con $a_n = (1 + 1/n)^n$ y $\varepsilon = 0.1$ los términos entran a la banda en $n = 13$. Al reducir $\varepsilon$ a 0.01 el índice crece mucho, pero sigue existiendo: eso es lo que exige la definición. Con $a_n = (-1)^n$ no hay banda posible, porque los términos alternan entre $-1$ y $1$. Con $\operatorname{sen}(n)/n$ los términos oscilan sin orden aparente y aun así convergen a 0.

## Ejemplo

Se demuestra que $a_n = \frac{n}{n + 1}$ converge a 1, la proporción de respuestas correctas de un sistema de reconocimiento que acierta $n$ de cada $n + 1$ ejemplos.

1. La distancia al límite es $|a_n - 1| = \left|\frac{n - (n + 1)}{n + 1}\right| = \frac{1}{n + 1}$.
2. Dado $\varepsilon > 0$, se quiere $\frac{1}{n + 1} < \varepsilon$, es decir, $n > \frac{1}{\varepsilon} - 1$.
3. Basta tomar $N$ como cualquier natural mayor que $\frac{1}{\varepsilon} - 1$.
4. Con $\varepsilon = 0.01$: $N = 100$ funciona, porque para $n \ge 100$, $\frac{1}{n + 1} \le \frac{1}{101} < 0.01$.

:::figura[La sucesión del ejemplo, $n/(n + 1)$, con tolerancia 0.01. Todos los términos a partir de $N(\varepsilon)$ quedan dentro de la banda; al reducir la tolerancia, el índice aumenta pero siempre existe.]{componente="SequenceSeries"}
```yaml
modo: sucesion
sucesion: cociente
epsilon: 0.01
terminos: 150
```
:::

## Propiedades

- **Unicidad:** una sucesión tiene a lo más un límite.
- Toda sucesión convergente es acotada; el recíproco es falso, como muestra $(-1)^n$.
- **Álgebra de límites:** si $a_n \to a$ y $b_n \to b$, entonces $a_n + b_n \to a + b$, $a_n b_n \to ab$ y, si $b \neq 0$, $a_n / b_n \to a/b$.
- **Compresión:** si $a_n \le b_n \le c_n$ y $a_n, c_n \to L$, entonces $b_n \to L$.
- **Convergencia monótona:** toda sucesión monótona creciente y acotada superiormente converge a su supremo.
- Límites básicos: $1/n \to 0$, $r^n \to 0$ si $|r| < 1$, $n^{1/n} \to 1$ y $(1 + 1/n)^n \to e$.

:::demostracion
Para la unicidad, si $a_n \to L$ y $a_n \to L'$ con $L \neq L'$, tomamos $\varepsilon = |L - L'|/2$. Para $n$ suficientemente grande, $|L - L'| \le |L - a_n| + |a_n - L'| < 2\varepsilon = |L - L'|$, una contradicción.
:::

## Errores comunes

- **Pensar que la sucesión debe alcanzar el límite.** $1/n$ nunca vale 0 y converge a 0.
- **Confundir acotada con convergente.** Una sucesión puede oscilar indefinidamente dentro de un intervalo.
- **Cambiar el orden de los cuantificadores.** $N$ depende de $\varepsilon$; no se exige un $N$ que sirva para todos los $\varepsilon$.
- **Concluir la convergencia por los primeros términos.** Una sucesión puede parecer estable durante mil términos y después crecer.

:::figura[Acotada no es lo mismo que convergente. $(-1)^n$ nunca sale de $[-1, 1]$ y no converge; $\operatorname{sen}(n)/n$ oscila sin patrón aparente y sí converge a 0.]{componente="SequenceSeries"}
```yaml
modo: sucesion
sucesion: oscilante
sucesiones: [oscilante, seno-entre-n]
epsilon: 0.1
terminos: 60
```
:::

## Conexiones

Una sucesión es una de las [[funciones]] con dominio en los naturales, y su definición de límite combina [[cuantificadores-universal-y-existencial|cuantificadores]] en un orden preciso. Las sumas parciales de una sucesión definen las [[series-y-convergencia-de-series|series]], y el teorema de convergencia monótona usa el [[supremo-e-infimo|supremo]]. En estadística, la consistencia de un estimador y la ley de los grandes números son afirmaciones sobre límites de sucesiones.
