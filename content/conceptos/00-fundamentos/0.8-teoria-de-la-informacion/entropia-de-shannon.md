---
id: entropia-de-shannon
titulo: Entropía de Shannon
titulo_en: Shannon entropy
alias:
  - entropía
  - entropía de la información
  - incertidumbre
modulo: 0
submodulo: '0.8'
orden: 2
nivel: intermedio
prerrequisitos:
  - contenido-de-informacion
  - esperanza-matematica
etiquetas:
  - entropía
  - incertidumbre
  - bits
  - teoría de la información
resumen: >
  La entropía H(X) = -Σ p(x) log2 p(x) es la sorpresa promedio de una variable discreta: cero si el
  resultado es seguro y máxima, log2 k, cuando los k valores son igualmente probables.
formula: 'H(X) = -\sum_{x} p(x) \log_2 p(x) = \mathbb{E}\left[-\log_2 p(X)\right]'
visualizacion:
  componente: InformationViz
  parametros:
    modo: entropia
    p: [0.5, 0.25, 0.125, 0.125]
    etiquetas: [A, B, C, D]
referencias:
  - clave: cover-thomas
    capitulo: '2'
  - clave: murphy
publicado: true
---

## Intuición

En el juego de adivinar un objeto con preguntas de sí o no, la cantidad de preguntas necesarias depende de lo predecible que sea la respuesta. Si de cuatro opciones una aparece la mitad de las veces, conviene preguntar primero por ella: la mitad de las veces se acierta con una sola pregunta. Si las cuatro son igual de probables, no hay atajo y siempre se necesitan dos.

La entropía es ese número de preguntas en promedio, cuando se elige la mejor estrategia y se juega muchas veces. Formalmente es el promedio de la sorpresa $-\log_2 p(x)$ de cada resultado, ponderado por su probabilidad. Mide la incertidumbre de una variable antes de observarla, o lo que es lo mismo, cuánta información trae en promedio su observación.

Una distribución muy concentrada tiene entropía baja: casi siempre sale lo mismo y observarla dice poco. Una distribución pareja sobre muchos valores tiene entropía alta. La entropía solo depende de las probabilidades, no de los valores ni de su orden.

## Definición

:::definicion[Entropía de Shannon]
Sea $X$ una variable aleatoria discreta con función de masa $p$ sobre un conjunto finito o numerable $\mathcal{X}$. Su entropía es
$$
H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x) = \mathbb{E}\left[-\log_2 p(X)\right],
$$
con la convención $0 \log_2 0 = 0$, que corresponde al límite de $t \log_2 t$ cuando $t \to 0$.
:::

Si $X$ toma $k$ valores, $0 \le H(X) \le \log_2 k$. Para dos valores con probabilidades $p$ y $1 - p$ se escribe la entropía binaria $H_b(p) = -p\log_2 p - (1-p)\log_2(1-p)$.

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria discreta.
- $\mathcal{X}$: conjunto de valores posibles de $X$.
- $p(x)$: probabilidad de que $X$ valga $x$.
- $H(X)$: entropía, en bits con logaritmo base 2.
- $\mathbb{E}$: esperanza.
- $k$: número de valores posibles.
- $H_b(p)$: entropía de una variable con dos valores de probabilidades $p$ y $1 - p$.
:::

## Cómo usar la visualización

Cada barra es la probabilidad de un valor y, encima, su sorpresa en bits. Los controles cambian el peso de cada valor; las barras se normalizan para sumar 1. El encabezado escribe la suma de los términos $-p(x)\log_2 p(x)$ y su total. La reproducción mezcla la distribución con la uniforme, paso a paso, hasta llegar a ella.

Con la distribución inicial (0.5, 0.25, 0.125, 0.125) la entropía es exactamente 1.75 bits. Al reproducir, sube hasta 2 bits, que es $\log_2 4$ y el máximo posible con cuatro valores. Si se lleva el peso de un solo valor a 1 y los demás a 0, la entropía baja a cero.

## Ejemplo

En una población, los grupos sanguíneos O, A, B y AB tienen frecuencias 0.6, 0.3, 0.08 y 0.02. Se calcula la entropía del grupo de una persona elegida al azar.

1. Sorpresas: $-\log_2 0.6 = 0.737$, $-\log_2 0.3 = 1.737$, $-\log_2 0.08 = 3.644$ y $-\log_2 0.02 = 5.644$ bits.
2. Términos $p\,I$: $0.6 \cdot 0.737 = 0.442$, $0.3 \cdot 1.737 = 0.521$, $0.08 \cdot 3.644 = 0.292$ y $0.02 \cdot 5.644 = 0.113$.
3. Suma: $H = 0.442 + 0.521 + 0.292 + 0.113 = 1.368$ bits.

Es bastante menos que los 2 bits de cuatro grupos igualmente frecuentes: el grupo O es tan común que adivinarlo acierta seis de cada diez veces.

:::figura[Grupos sanguíneos con frecuencias 0.6, 0.3, 0.08 y 0.02: la entropía parte de 1.368 bits y la animación la lleva a 2 bits al volver uniformes las frecuencias.]{componente="InformationViz"}
```yaml
modo: entropia
p: [0.6, 0.3, 0.08, 0.02]
etiquetas: [O, A, B, AB]
```
:::

## Propiedades

- **No negatividad:** $H(X) \ge 0$, con igualdad si y solo si $X$ es constante con probabilidad 1.
- **Máximo en la uniforme:** $H(X) \le \log_2 k$, con igualdad si y solo si los $k$ valores tienen probabilidad $1/k$.
- **Entropía binaria:** $H_b(p)$ es cóncava, simétrica respecto de $p = 1/2$ y alcanza su máximo de 1 bit en $p = 1/2$.

:::figura[Una moneda cargada con probabilidad 0.9 de cara tiene entropía 0.469 bits; el punto sobre la curva de entropía binaria sube hasta 1 bit cuando la animación la vuelve justa.]{componente="InformationViz"}
```yaml
modo: entropia
p: [0.9, 0.1]
etiquetas: [cara, cruz]
```
:::

- **Invariancia:** $H$ no cambia si se renombran o se permutan los valores; depende solo del conjunto de probabilidades.
- **Concavidad:** la entropía de una mezcla de distribuciones es al menos el promedio de sus entropías; por eso mezclar con la uniforme siempre la aumenta.
- **Aditividad:** si $X$ y $Y$ son independientes, $H(X, Y) = H(X) + H(Y)$.

## Errores comunes

- **Confundir entropía con varianza.** La varianza depende de los valores y de su distancia; la entropía solo de las probabilidades. Una variable que vale 1 o 5 con probabilidades 0.8 y 0.2 tiene la misma entropía, 0.722 bits, que una que vale 3 o 4 con esas mismas probabilidades, aunque su varianza sea dieciséis veces mayor.

:::figura[Probabilidades 0.8 y 0.2 colocadas en los extremos de cinco valores: la entropía es 0.722 bits, la misma que tendrían en dos valores vecinos, porque la distancia entre valores no interviene.]{componente="InformationViz"}
```yaml
modo: entropia
p: [0.8, 0, 0, 0, 0.2]
etiquetas: ['1', '2', '3', '4', '5']
```
:::

- **Usar logaritmos de distinta base sin decirlo.** Con logaritmo natural la entropía se mide en nats: 1.75 bits son $1.75 \cdot 0.693 = 1.213$ nats.
- **Olvidar la convención $0 \log 0 = 0$.** Un valor de probabilidad cero no aporta a la entropía; calcularlo literalmente da una indeterminación.
- **Creer que más valores siempre significan más entropía.** Agregar valores con probabilidad casi nula apenas la cambia; lo que cuenta es cómo se reparte la probabilidad.

## Conexiones

La entropía es la [[esperanza-matematica]] del [[contenido-de-informacion]] bajo la [[funcion-de-masa-de-probabilidad]]. Para dos variables se extiende a la [[entropia-conjunta]] y a la [[entropia-condicional]]; comparada con la sorpresa bajo otra distribución da la [[entropia-cruzada]]. El [[teorema-de-codificacion-de-fuente]] le da su significado operativo como número mínimo de bits por símbolo, y el [[principio-de-maxima-entropia]] la usa para elegir distribuciones.

## Formulario

:::formula[Entropía]
$$
H(X) = -\sum_{x \in \mathcal{X}} p(x)\log_2 p(x)
$$

- $X$: variable discreta; $\mathcal{X}$: sus valores; $p(x)$: su función de masa; $H(X)$: entropía en bits.
:::

:::formula[Cotas]
$$
0 \le H(X) \le \log_2 k
$$

- $k$: número de valores de $X$; la cota superior se alcanza solo con la distribución uniforme.
:::

:::formula[Entropía binaria]
$$
H_b(p) = -p\log_2 p - (1 - p)\log_2(1 - p)
$$

- $p$: probabilidad de uno de los dos valores; $H_b(p)$: entropía en bits, máxima de 1 en $p = 1/2$.
:::

:::formula[Cambio de unidad]
$$
H_{\text{nats}} = H_{\text{bits}} \cdot \log 2
$$

- $H_{\text{bits}}$: entropía con logaritmo base 2; $H_{\text{nats}}$: con logaritmo natural; $\log 2 = 0.693$.
:::
