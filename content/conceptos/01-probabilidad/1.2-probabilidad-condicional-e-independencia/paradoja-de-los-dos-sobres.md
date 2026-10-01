---
id: paradoja-de-los-dos-sobres
titulo: Paradoja de los dos sobres
titulo_en: Two envelopes problem
alias:
  - problema de los dos sobres
  - paradoja del intercambio
modulo: 1
submodulo: '1.2'
orden: 22
nivel: intermedio
prerrequisitos:
  - teorema-de-bayes
relaciones:
  - tipo: relacionado
    id: paradoja-de-san-petersburgo
etiquetas:
  - paradojas
  - valor esperado
  - distribución a priori
  - razonamiento erróneo
resumen: >
  Un sobre tiene el doble de dinero que otro. El argumento "el otro vale 1.25 veces lo que veo" sugiere
  cambiar siempre, pero es falso: supone que ambas posibilidades tienen probabilidad 1/2 para cualquier cantidad.
formula: '\mathbb{E}[\text{otro} \mid A = a] = a\left(2\,P(\text{menor} \mid a) + \tfrac{1}{2}\,P(\text{mayor} \mid a)\right)'
visualizacion:
  componente: TwoEnvelopes
  parametros:
    maximo: 100
    umbral: 100
    juegos: 5000
referencias:
  - clave: blitzstein-hwang
    capitulo: '9'
  - clave: degroot
publicado: true
---

## Intuición

Se ofrecen dos sobres cerrados; uno contiene el doble de dinero que el otro. Se elige uno al azar, se abre y contiene 100 pesos. Se ofrece cambiar. Un razonamiento tentador dice: el otro sobre tiene 50 o 200 pesos con la misma probabilidad, así que su valor esperado es $\frac{1}{2}\cdot 50 + \frac{1}{2}\cdot 200 = 125$, más que 100; conviene cambiar. Pero el mismo argumento vale para cualquier cantidad, e incluso sin abrir el sobre, lo que llevaría a cambiar una y otra vez sin fin. Algo está mal.

El error está en "con la misma probabilidad". Para que el otro sobre tenga 50 o 200 con probabilidad 1/2 cada uno, sin importar lo que se vea, haría falta que todas las cantidades fueran igualmente probables, y no existe una distribución así sobre infinitas cantidades. Con cualquier distribución real de las cantidades, ver un monto grande hace más probable que sea el sobre mayor, y ver uno pequeño, que sea el menor.

Lo que sí es cierto es que, sin información sobre la distribución, quedarse y cambiar siempre tienen el mismo valor esperado. Y si se conoce algo de la distribución, cambiar solo cuando la cantidad es pequeña sí da ganancia.

## Definición

Sea $X > 0$ la cantidad menor, con alguna distribución, y sean las cantidades de los sobres $X$ y $2X$. Se abre un sobre al azar con cantidad $A$, y el otro tiene $B$.

:::teorema[Resolución]
1. Las estrategias "quedarse siempre" y "cambiar siempre" tienen la misma ganancia esperada, $\frac{3}{2}\mathbb{E}[X]$, porque $A$ y $B$ tienen la misma distribución.
2. Por el teorema de Bayes, $P(A \text{ es el menor} \mid A = a)$ depende de $a$ y de la distribución de $X$; no puede ser $1/2$ para todo $a$ si $X$ tiene una distribución propia.
3. Una regla que cambia solo cuando $A$ es menor que un umbral tiene ganancia esperada mayor que quedarse, siempre que haya probabilidad positiva de que el umbral quede entre $X$ y $2X$.
:::

:::figura[Con un umbral de 50 en lugar de 100, la estrategia de umbral sigue ganando a quedarse y a cambiar siempre, aunque menos que con el umbral de 100.]{componente="TwoEnvelopes"}
```yaml
maximo: 100
umbral: 50
juegos: 5000
```
:::

:::nota[Qué significa cada símbolo]
- $X$: cantidad del sobre menor; el mayor tiene $2X$.
- $A$: cantidad del sobre abierto; $B$: la del otro sobre.
- $a$: valor observado de $A$.
- $P(\text{menor} \mid a)$: probabilidad de que el sobre abierto sea el menor dado que contiene $a$.
- $\mathbb{E}[\cdot]$: valor esperado; $\mathbb{E}[X]$: cantidad menor promedio.
- $M$: en la simulación, $X$ es uniforme en $[1, M]$; $t$: umbral de cambio.
:::

## Cómo usar la visualización

Cada juego elige la cantidad menor uniforme entre 1 y $M$, pone las cantidades en dos sobres y abre uno al azar. A la izquierda, cada punto es un juego: la cantidad abierta en el eje horizontal y lo que se ganaría al cambiar en el vertical. A la derecha, se acumulan las ganancias medias de tres estrategias: quedarse, cambiar siempre y cambiar solo si la cantidad abierta es menor que el umbral $t$. El encabezado muestra el argumento ingenuo para el último juego y lo que realmente había en el otro sobre.

Los puntos forman dos rectas: cambiar gana $a$ cuando el sobre abierto es el menor y pierde $a/2$ cuando es el mayor. Por encima de $M$ el sobre abierto solo puede ser el mayor y cambiar siempre pierde. Quedarse y cambiar siempre convergen al mismo valor, $1.5 \cdot (1 + M)/2$; la estrategia de umbral queda claramente por encima.

## Ejemplo

Supóngase que la cantidad menor es 10, 20 o 40 pesos con probabilidades 0.5, 0.3 y 0.2. Se abre un sobre con 20 pesos.

1. Abrir 20 puede ocurrir si $X = 20$ (y se abrió el menor) o si $X = 10$ (y se abrió el mayor).
2. $P(X = 20, \text{abre menor}) = 0.3 \cdot 0.5 = 0.15$; $P(X = 10, \text{abre mayor}) = 0.5 \cdot 0.5 = 0.25$.
3. $P(\text{menor} \mid A = 20) = 0.15/(0.15 + 0.25) = 0.375$, no 1/2.
4. $\mathbb{E}[B \mid A = 20] = 0.375 \cdot 40 + 0.625 \cdot 10 = 21.25$: con 20 conviene cambiar, pero por un margen menor que el que predice el argumento ingenuo (25).
5. Si se abre 80, el sobre es seguro el mayor y cambiar da 40: pierde la mitad.

:::figura[El ejemplo con Bayes: tras ver 20 pesos, las hipótesis "abrí el menor" y "abrí el mayor" quedan con 0.375 y 0.625, no con 1/2 cada una.]{componente="ProbabilityTree"}
```yaml
niveles: [Cantidad menor, Sobre abierto]
ramas:
  - etiqueta: X = 10
    prob: 0.5
    ramas:
      - etiqueta: Abre 10
        prob: 0.5
      - etiqueta: Abre 20
        prob: 0.5
  - etiqueta: X = 20
    prob: 0.3
    ramas:
      - etiqueta: Abre 20
        prob: 0.5
      - etiqueta: Abre 40
        prob: 0.5
  - etiqueta: X = 40
    prob: 0.2
    ramas:
      - etiqueta: Abre 40
        prob: 0.5
      - etiqueta: Abre 80
        prob: 0.5
consultas:
  - nombre: Abrí el menor dado que veo 20
    hojas: [X = 20/Abre 20]
    condicion: [X = 10/Abre 20, X = 20/Abre 20]
  - nombre: Abrí el menor dado que veo 40
    hojas: [X = 40/Abre 40]
    condicion: [X = 20/Abre 40, X = 40/Abre 40]
```
:::

## Propiedades

- **Simetría sin abrir:** antes de abrir, $A$ y $B$ tienen la misma distribución, así que ningún argumento puede justificar cambiar siempre.
- **Distribuciones impropias:** el argumento de 1.25 equivale a suponer una distribución "uniforme" sobre todas las potencias de 2, que no existe porque sus probabilidades no pueden sumar 1.
- **Esperanza infinita:** existen distribuciones propias de $X$ en las que cambiar mejora la esperanza condicional para todo $a$, pero entonces $\mathbb{E}[X] = \infty$ y la comparación de esperanzas deja de tener sentido, como en la paradoja de San Petersburgo.
- **Umbral aleatorio:** elegir el umbral al azar con una distribución que dé probabilidad positiva a todo intervalo garantiza una ganancia esperada mayor que quedarse, sin conocer la distribución de $X$.

:::figura[Un rango mayor de cantidades (M = 500) con el mismo umbral de 100: el umbral ya no es tan informativo y la ventaja de la estrategia de umbral se reduce, aunque sigue siendo positiva.]{componente="TwoEnvelopes"}
```yaml
maximo: 500
umbral: 100
juegos: 5000
```
:::

## Errores comunes

- **Asignar probabilidad 1/2 a "menor" y "mayor" para cualquier cantidad observada.** Esa probabilidad depende de la cantidad y de la distribución de las cantidades.
- **Usar la misma letra para dos cantidades distintas.** En $\frac{1}{2}\cdot\frac{A}{2} + \frac{1}{2}\cdot 2A$, la $A$ del primer término es el sobre mayor y la del segundo es el menor: son valores distintos de una variable aleatoria.
- **Concluir que da igual cambiar cuando se tiene información.** Si se sabe algo de la distribución, cambiar con montos pequeños y quedarse con los grandes sí mejora la ganancia.

:::figura[Un umbral inútil (t = 0, nunca se cambia) reproduce la estrategia de quedarse, y las tres ganancias medias convergen al mismo valor: sin información no hay ventaja en cambiar.]{componente="TwoEnvelopes"}
```yaml
maximo: 100
umbral: 0
juegos: 5000
```
:::

## Conexiones

La paradoja se resuelve con el [[teorema-de-bayes]]: la probabilidad de haber abierto el sobre menor depende de la cantidad observada y de la distribución a priori. Comparte con la [[paradoja-de-san-petersburgo]] la aparición de esperanzas infinitas y con el [[problema-de-monty-hall]] la importancia de modelar cómo se generó la información. En estadística bayesiana ilustra los problemas de usar distribuciones a priori impropias como si fueran probabilidades.

## Formulario

:::formula[Argumento ingenuo (incorrecto)]
$$
\mathbb{E}[B \mid A = a] \overset{?}{=} \tfrac{1}{2}\cdot\tfrac{a}{2} + \tfrac{1}{2}\cdot 2a = 1.25\,a
$$

- Supone $P(\text{menor} \mid a) = 1/2$ para todo $a$, lo que no es posible con una distribución propia.
:::

:::formula[Esperanza condicional correcta]
$$
\mathbb{E}[B \mid A = a] = 2a\,P(\text{menor} \mid a) + \tfrac{a}{2}\,P(\text{mayor} \mid a)
$$

- $P(\text{menor} \mid a)$: se calcula con el teorema de Bayes a partir de la distribución de $X$.
:::

:::formula[Bayes para el sobre abierto]
$$
P(\text{menor} \mid A = a) = \frac{f(a)}{f(a) + f(a/2)}
$$

- $f$: probabilidad de que la cantidad menor tome cada valor (caso discreto). Si $X$ tiene densidad $f$, el segundo término del denominador se divide entre 2: $f(a) / (f(a) + \tfrac{1}{2}f(a/2))$.
:::

:::formula[Ganancia de quedarse o cambiar siempre]
$$
\mathbb{E}[A] = \mathbb{E}[B] = \tfrac{3}{2}\,\mathbb{E}[X]
$$

- Las dos estrategias simples tienen el mismo valor esperado.
:::
