---
id: entropia-diferencial
titulo: Entropía diferencial
titulo_en: Differential entropy
alias:
  - entropía continua
  - h(X)
modulo: 0
submodulo: '0.8'
orden: 10
nivel: intermedio
prerrequisitos:
  - entropia-de-shannon
etiquetas:
  - entropía
  - variables continuas
  - densidad
  - teoría de la información
resumen: >
  La entropía diferencial h(X) = -∫ f log2 f extiende la entropía a variables continuas. Puede ser
  negativa, cambia con la escala y, para varianza fija, es máxima en la normal.
formula: 'h(X) = -\int f(x) \log_2 f(x)\,dx, \qquad h\big(\mathcal{N}(\mu, \sigma^2)\big) = \tfrac{1}{2}\log_2(2\pi e\,\sigma^2)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: diferencial
    familia: normal
referencias:
  - clave: cover-thomas
    capitulo: '8'
publicado: true
---

## Intuición

Una temperatura medida con precisión infinita tiene infinitos valores posibles, y describirla exactamente requeriría infinitos bits. Por eso la entropía de Shannon no se puede usar tal cual con variables continuas. Lo que sí tiene sentido es comparar: cuánto más incierta es una variable que otra, o cuántos bits hacen falta al redondear a una precisión dada.

La entropía diferencial hace esa comparación reemplazando las probabilidades por la densidad. Una densidad muy repartida tiene entropía diferencial alta; una muy concentrada, baja. Como una densidad puede ser mayor que 1 cuando se concentra en un intervalo corto, la entropía diferencial puede ser negativa, algo imposible en el caso discreto. Un valor negativo no significa información negativa: significa que la variable está más concentrada que una uniforme en un intervalo de longitud 1.

Si se redondea la variable a intervalos de ancho $\Delta$, la entropía discreta del resultado es aproximadamente $h(X) - \log_2 \Delta$: la entropía diferencial es la parte que no depende de la precisión.

## Definición

:::definicion[Entropía diferencial]
Sea $X$ una variable aleatoria continua con densidad $f$ y soporte $S = \{x : f(x) > 0\}$. Su entropía diferencial es
$$
h(X) = -\int_{S} f(x) \log_2 f(x)\,dx = \mathbb{E}\left[-\log_2 f(X)\right],
$$
cuando la integral existe.
:::

Para tres familias comunes:
$$
h\big(\mathcal{U}(0, a)\big) = \log_2 a, \qquad h\big(\mathcal{N}(\mu, \sigma^2)\big) = \tfrac{1}{2}\log_2(2\pi e\,\sigma^2), \qquad h\big(\operatorname{Exp}(\lambda)\big) = \log_2 \frac{e}{\lambda}.
$$

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria continua.
- $f$: su densidad; $S$: el conjunto donde es positiva.
- $h(X)$: entropía diferencial en bits.
- $\mathcal{U}(0, a)$: uniforme en el intervalo $[0, a]$; $a$: su longitud.
- $\mathcal{N}(\mu, \sigma^2)$: normal de media $\mu$ y desviación $\sigma$.
- $\operatorname{Exp}(\lambda)$: exponencial de tasa $\lambda$.
- $e$: base del logaritmo natural; $\pi$: la constante pi.
:::

## Cómo usar la visualización

La curva es la densidad de una normal centrada y el área sombreada bajo ella siempre vale 1. La línea punteada marca la altura 1. La reproducción aumenta la desviación $\sigma$ de 0.15 a 2 y el encabezado evalúa la fórmula cerrada en cada paso.

Al inicio, con $\sigma = 0.15$, la densidad alcanza 2.66 de altura y $h = -0.690$ bits, un valor negativo. La entropía cruza cero cuando $\sigma$ pasa por $0.242$, la desviación con la que el pico de la normal mide 1.65, y termina en $3.047$ bits con $\sigma = 2$. Cada vez que $\sigma$ se duplica, $h$ sube exactamente 1 bit.

## Ejemplo

El tiempo hasta la siguiente llamada en un centro de atención es exponencial con tasa $\lambda = 2$ llamadas por minuto.

1. $h(X) = \log_2 \frac{e}{2} = \log_2 1.359 = 0.443$ bits.
2. Si el tiempo se midiera en segundos, la tasa sería $\lambda = 2/60$ por segundo y $h = \log_2 \frac{60e}{2} = 0.443 + \log_2 60 = 6.350$ bits.
3. Si se redondea el tiempo en minutos a intervalos de $\Delta = 0.01$, la entropía discreta del resultado es cercana a $0.443 - \log_2 0.01 = 0.443 + 6.644 = 7.087$ bits.

El cambio de unidades sumó $\log_2 60$: la entropía diferencial depende de la escala.

:::figura[Exponencial de tasa creciente, de 0.5 a 4: la entropía diferencial baja de 2.443 bits y cruza cero en la tasa $e = 2.718$, cuando la densidad empieza en una altura mayor que 2.7.]{componente="InformationViz"}
```yaml
modo: diferencial
familia: exponencial
parametro: 0.5
```
:::

## Propiedades

- **Traslación:** $h(X + c) = h(X)$.
- **Escala:** $h(aX) = h(X) + \log_2 |a|$ para $a \ne 0$; en varias dimensiones, $h(\mathbf{A}\mathbf{X}) = h(\mathbf{X}) + \log_2 |\det \mathbf{A}|$.

:::figura[Uniforme en $[0, a]$ con $a$ de 0.25 a 4: la entropía diferencial es $\log_2 a$, pasa de $-2$ a 2 bits, vale cero con $a = 1$ y sube un bit cada vez que el intervalo se duplica.]{componente="InformationViz"}
```yaml
modo: diferencial
familia: uniforme
parametro: 0.25
```
:::

- **Máximo con varianza fija:** entre todas las densidades con varianza $\sigma^2$, la normal tiene la mayor entropía diferencial, $\tfrac{1}{2}\log_2(2\pi e\,\sigma^2)$.
- **Discretización:** si $X^\Delta$ es $X$ redondeada a una rejilla de paso $\Delta$, $H(X^\Delta) + \log_2 \Delta \to h(X)$ cuando $\Delta \to 0$. Para la normal estándar con $\Delta = 0.1$, $H(X^\Delta) = 5.369$ y $h - \log_2 0.1 = 5.369$.
- **Divergencia:** $D_{\mathrm{KL}}(f \,\|\, g) = \int f \log \frac{f}{g}$ sigue siendo no negativa e invariante ante cambios de escala, a diferencia de $h$.

## Errores comunes

- **Pensar que no puede ser negativa.** Con una densidad concentrada, $h < 0$: la uniforme en $[0, 0.25]$ tiene $h = -2$ bits.
- **Tratarla como el límite de la entropía discreta.** La entropía discreta de la versión redondeada crece sin límite cuando $\Delta \to 0$; lo que converge es $H(X^\Delta) + \log_2 \Delta$.
- **Comparar entropías diferenciales en unidades distintas.** Medir en centímetros en lugar de metros suma $\log_2 100 = 6.644$ bits.

:::figura[Normal con desviación inicial 0.5: la entropía diferencial parte de 1.047 bits; medir en otra unidad equivale a cambiar $\sigma$, y con $\sigma = 1$ ya vale 2.047, un bit más, aunque la variable sea la misma.]{componente="InformationViz"}
```yaml
modo: diferencial
familia: normal
parametro: 0.5
```
:::

- **Olvidar que puede no existir.** Hay densidades para las que la integral diverge; la fórmula requiere que $\mathbb{E}[|\log f(X)|]$ sea finita.

## Conexiones

Traslada la [[entropia-de-shannon]] a variables con [[funcion-de-densidad-de-probabilidad]]. El máximo de la normal con varianza fija es un caso del [[principio-de-maxima-entropia]]. La [[divergencia-de-kullback-leibler]] entre densidades conserva las buenas propiedades que la entropía diferencial pierde, y la [[asimetria-de-la-divergencia-kl]] se estudia con densidades.

## Formulario

:::formula[Entropía diferencial]
$$
h(X) = -\int f(x)\log_2 f(x)\,dx
$$

- $X$: variable continua; $f$: su densidad; $h(X)$: entropía diferencial en bits.
:::

:::formula[Uniforme, normal y exponencial]
$$
\log_2 a, \qquad \tfrac{1}{2}\log_2(2\pi e\,\sigma^2), \qquad \log_2\frac{e}{\lambda}
$$

- $a$: longitud del intervalo de la uniforme; $\sigma$: desviación de la normal; $\lambda$: tasa de la exponencial; $e$ y $\pi$: constantes.
:::

:::formula[Cambio de escala]
$$
h(aX + c) = h(X) + \log_2|a|
$$

- $a$: factor de escala distinto de cero; $c$: traslación, que no cambia la entropía.
:::

:::formula[Discretización]
$$
H(X^\Delta) \approx h(X) - \log_2 \Delta
$$

- $X^\Delta$: variable redondeada a intervalos de ancho $\Delta$; $H$: entropía discreta.
:::
