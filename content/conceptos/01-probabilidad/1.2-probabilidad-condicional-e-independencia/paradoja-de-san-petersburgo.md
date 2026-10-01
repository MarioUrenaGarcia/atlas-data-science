---
id: paradoja-de-san-petersburgo
titulo: Paradoja de San Petersburgo
titulo_en: St. Petersburg paradox
alias:
  - juego de San Petersburgo
  - paradoja de Bernoulli
modulo: 1
submodulo: '1.2'
orden: 21
nivel: intermedio
prerrequisitos:
  - serie-geometrica
  - independencia-de-eventos
relaciones:
  - tipo: relacionado
    id: paradoja-de-los-dos-sobres
etiquetas:
  - paradojas
  - valor esperado infinito
  - utilidad
  - colas pesadas
resumen: >
  Un juego paga 2^(k-1) si la primera cara aparece en el lanzamiento k. Su pago esperado es infinito,
  pero nadie pagaría mucho por jugarlo: el promedio de pagos crece apenas como log2(n)/2.
formula: '\mathbb{E}[X] = \sum_{k=1}^{\infty} \frac{1}{2^{k}}\cdot 2^{k-1} = \sum_{k=1}^{\infty}\frac{1}{2} = \infty'
visualizacion:
  componente: StPetersburg
  parametros:
    limiteExponente: 0
    juegos: 20000
referencias:
  - clave: blitzstein-hwang
    capitulo: '4'
  - clave: degroot
publicado: true
---

## Intuición

Un casino ofrece este juego: se lanza una moneda hasta que sale cara. Si la primera cara aparece en el lanzamiento 1, el casino paga 1 peso; si aparece en el 2, paga 2; en el 3, paga 4; y en general, $2^{k-1}$ pesos si aparece en el lanzamiento $k$. ¿Cuánto estaría dispuesta a pagar una persona por jugar una vez?

El cálculo del pago esperado da una respuesta absurda. El primer caso aporta $\frac{1}{2}\cdot 1$, el segundo $\frac{1}{4}\cdot 2$, el tercero $\frac{1}{8}\cdot 4$: cada caso aporta 1/2, y hay infinitos casos, así que el pago esperado es infinito. Según ese criterio, convendría pagar cualquier cantidad. Sin embargo, la mayoría de las personas no pagaría más de unos 10 o 20 pesos, y con buenas razones: la mitad de las veces el juego paga 1 peso, y pagar más de 16 solo ocurre una de cada 32 veces.

La paradoja, planteada por Nicolás Bernoulli en 1713, muestra que el valor esperado no siempre describe bien una apuesta. Las soluciones propuestas incluyen la utilidad decreciente del dinero (Daniel Bernoulli), la imposibilidad de que un casino pague cantidades arbitrarias y el comportamiento real de los promedios cuando la esperanza es infinita.

## Definición

Sea $K$ el número del lanzamiento en que aparece la primera cara de una moneda equilibrada, con $P(K = k) = 2^{-k}$ para $k = 1, 2, \dots$, y sea $X = 2^{K-1}$ el pago.

:::teorema[Esperanza infinita]
$$
\mathbb{E}[X] = \sum_{k=1}^{\infty} 2^{k-1}\cdot 2^{-k} = \sum_{k=1}^{\infty}\frac{1}{2} = \infty.
$$
Si el banco solo puede pagar hasta $2^{m}$, el pago es $\min(X, 2^{m})$ y su esperanza es finita: $\mathbb{E}[\min(X, 2^{m})] = \frac{m + 2}{2}$.
:::

:::demostracion
Para el caso con límite, los valores $k = 1, \dots, m+1$ aportan $1/2$ cada uno, en total $(m+1)/2$; los valores $k > m + 1$ pagan $2^{m}$ y tienen probabilidad total $2^{-(m+1)}$, que aportan $2^{m}\cdot 2^{-(m+1)} = 1/2$.
:::

:::figura[Con un banco que puede pagar a lo más 2 elevado a 20 (cerca de un millón de pesos), la esperanza baja a 11 pesos, y la media acumulada se estabiliza alrededor de ese valor.]{componente="StPetersburg"}
```yaml
limiteExponente: 20
juegos: 20000
```
:::

:::nota[Qué significa cada símbolo]
- $K$: lanzamiento en que aparece la primera cara; $P(K = k) = 2^{-k}$.
- $X = 2^{K-1}$: pago del juego.
- $\mathbb{E}[X]$: pago esperado (esperanza).
- $m$: exponente del límite de pago del banco, que paga a lo más $2^{m}$.
- $n$: número de juegos jugados; $\log_2$: logaritmo en base 2.
- $\bar{X}_n$: promedio de los pagos de $n$ juegos.
:::

## Cómo usar la visualización

Cada paso juega muchas partidas. A la izquierda, cada barra muestra cuánto aportan a la media los juegos que terminaron en cada lanzamiento; la línea sobre cada barra es el aporte teórico, 1/2 para todos. A la derecha, la media acumulada de los pagos se grafica con eje logarítmico de juegos, junto a la referencia $\log_2(n)/2$.

Las barras de los primeros lanzamientos coinciden con 1/2, pero las de lanzamientos altos casi siempre están vacías: esos juegos son tan raros que en 20000 partidas aparecen pocas veces o ninguna, y cuando aparecen producen saltos enormes en la media. La media no se estabiliza: crece lentamente, a saltos, cerca de $\log_2(n)/2$. Al poner un límite al banco, la media converge al valor finito.

## Ejemplo

¿Cuánto paga en promedio el juego en 1000 partidas?

1. Cada valor de $K$ aporta 1/2 a la esperanza, pero en 1000 partidas solo se observan valores de $K$ hasta cerca de $\log_2 1000 \approx 10$.
2. Los casos $K \le 10$ aportan aproximadamente $10 \cdot \frac{1}{2} = 5$ pesos por partida.
3. Por eso, en 1000 partidas la ganancia media suele estar cerca de 5 pesos, aunque una partida rara con $K = 15$ paga $2^{14} = 16384$ y sube la media en más de 16.
4. Con un límite de pago de $2^{10} = 1024$ pesos, la esperanza es $(10 + 2)/2 = 6$ pesos: un precio justo modesto.

:::figura[Con un límite de pago de 2 elevado a 10 (1024 pesos), la esperanza es 6 pesos y la media simulada converge a ese valor.]{componente="StPetersburg"}
```yaml
limiteExponente: 10
juegos: 20000
```
:::

## Propiedades

- **Crecimiento logarítmico de la media:** el promedio de $n$ partidas se comporta como $\log_2(n)/2$, aunque con saltos impredecibles; no converge.
- **Precio justo con límite de banco:** si el banco puede pagar $2^{m}$, el precio justo es $(m+2)/2$; incluso con el PIB mundial como límite, es de unos 25 pesos.
- **Utilidad logarítmica:** con utilidad $\log x$, la utilidad esperada del juego es finita: $\sum_k 2^{-k}(k-1)\log 2 = \log 2$, equivalente a un pago seguro de 2 pesos.
- **Colas pesadas:** $P(X \ge x) \approx 1/x$; la cola cae tan lentamente que la esperanza no existe, propiedad que comparten muchas distribuciones de riqueza o tamaño de catástrofes.

:::figura[Sin límite de pago, la media acumulada sigue subiendo a saltos con más juegos: en 200000 partidas suele andar cerca de 9 o 10, sin estabilizarse.]{componente="StPetersburg"}
```yaml
limiteExponente: 0
juegos: 200000
```
:::

## Errores comunes

- **Creer que la esperanza infinita significa ganancias grandes probables.** La mitad de las partidas paga 1 peso y tres de cada cuatro pagan a lo más 2.
- **Esperar que la media simulada se estabilice.** Con esperanza infinita, la ley de los grandes números no aplica en su forma usual; el promedio crece sin límite, aunque muy despacio.
- **Ignorar los límites reales.** Ningún banco puede pagar cantidades arbitrarias; con un límite realista, el valor esperado es pequeño.

:::figura[Un límite de pago pequeño (2 elevado a 5, es decir, 32 pesos): la esperanza es 3.5 pesos y la media se estabiliza rápido.]{componente="StPetersburg"}
```yaml
limiteExponente: 5
juegos: 20000
```
:::

## Conexiones

El cálculo usa la [[serie-geometrica]] para las probabilidades y la [[independencia-de-eventos]] de los lanzamientos. La paradoja motiva la teoría de la utilidad esperada y la distinción entre esperanza y comportamiento típico; se relaciona con la [[paradoja-de-los-dos-sobres]], donde también aparecen distribuciones sin esperanza finita, y con las distribuciones de colas pesadas, como la de Pareto, que modelan riqueza, tamaños de ciudades y pérdidas por desastres.

## Formulario

:::formula[Distribución del lanzamiento de la primera cara]
$$
P(K = k) = 2^{-k}, \qquad k = 1, 2, \dots
$$

- $K$: lanzamiento en que aparece la primera cara.
:::

:::formula[Esperanza del pago]
$$
\mathbb{E}[X] = \sum_{k=1}^{\infty} 2^{-k}\,2^{k-1} = \infty
$$

- Cada término vale $1/2$ y la serie diverge.
:::

:::formula[Esperanza con banco limitado]
$$
\mathbb{E}[\min(X, 2^{m})] = \frac{m + 2}{2}
$$

- $2^{m}$: pago máximo que el banco puede cubrir.
:::

:::formula[Media de n juegos]
$$
\bar{X}_n \approx \frac{\log_2 n}{2}
$$

- $\bar{X}_n$: promedio de los pagos de $n$ partidas; la aproximación describe su tendencia, no un límite.
:::

:::formula[Utilidad logarítmica esperada]
$$
\mathbb{E}[\log X] = \sum_{k=1}^{\infty} 2^{-k}(k - 1)\log 2 = \log 2
$$

- $\log$: logaritmo natural; equivale a recibir 2 pesos con certeza.
:::
