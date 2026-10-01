---
id: correlacion-de-distancia
titulo: Correlación de distancia
titulo_en: Distance correlation
alias:
  - dCor
  - covarianza de distancia
  - dependencia de distancia
modulo: 4
submodulo: '4.5'
orden: 13
nivel: avanzado
prerrequisitos:
  - covarianza-muestral
  - matrices-y-operaciones-con-matrices
relaciones:
  - tipo: contrasta
    id: coeficiente-de-correlacion-de-pearson
etiquetas:
  - asociación
  - dependencia no lineal
  - distancias
  - independencia
resumen: >
  La correlación de distancia compara las distancias entre pares de observaciones en cada variable. En
  la población vale cero solo si las variables son independientes, así que detecta relaciones no lineales.
formula: '\operatorname{dCor}(x, y) = \sqrt{\frac{\operatorname{dCov}^2(x, y)}{\sqrt{\operatorname{dVar}^2(x)\,\operatorname{dVar}^2(y)}}}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: correlacion
    medida: distancia
    lecturas: [distancia, pearson, spearman]
    generador:
      tipo: parabola
      n: 30
      ruido: 0.2
    nombres:
      x: Ángulo del panel solar respecto al óptimo
      y: Pérdida de energía
referencias:
  - clave: murphy
publicado: true
---

## Intuición

La pérdida de energía de un panel solar es mínima cuando está orientado de forma óptima y crece tanto si se inclina de más como si se inclina de menos. La relación es clarísima, pero tiene forma de U, y la correlación de Pearson sale cercana a cero: los puntos de la izquierda y de la derecha se cancelan. Pearson solo ve tendencias lineales.

La **correlación de distancia** usa otra idea. En lugar de comparar cada valor con la media, compara las observaciones entre sí: para cada par de paneles mide qué tan distintos son sus ángulos y qué tan distintas son sus pérdidas. Si las variables son independientes, saber que dos paneles tienen ángulos muy diferentes no dice nada sobre la diferencia de sus pérdidas. Si hay dependencia, de cualquier forma, las distancias en una variable se relacionan con las distancias en la otra. El coeficiente resume esa relación entre distancias en un número de 0 a 1, y en la población vale 0 únicamente cuando hay independencia.

## Definición

:::definicion[Correlación de distancia]
Sean $a_{ij} = |x_i - x_j|$ y $b_{ij} = |y_i - y_j|$ las matrices de distancias. Se **doblemente centran**:
$$
A_{ij} = a_{ij} - \bar{a}_{i\cdot} - \bar{a}_{\cdot j} + \bar{a}_{\cdot\cdot},
$$
y lo mismo para $B_{ij}$, donde $\bar{a}_{i\cdot}$ es la media de la fila $i$, $\bar{a}_{\cdot j}$ la de la columna $j$ y $\bar{a}_{\cdot\cdot}$ la media general. Se definen
$$
\operatorname{dCov}^2(x, y) = \frac{1}{n^2}\sum_{i,j} A_{ij}B_{ij}, \qquad \operatorname{dVar}^2(x) = \frac{1}{n^2}\sum_{i,j} A_{ij}^2,
$$
y la **correlación de distancia** es
$$
\operatorname{dCor}(x, y) = \sqrt{\frac{\operatorname{dCov}^2(x, y)}{\sqrt{\operatorname{dVar}^2(x)\,\operatorname{dVar}^2(y)}}}.
$$
:::

Vale entre 0 y 1. Fue propuesta por Székely, Rizzo y Bakirov en 2007 y se extiende a vectores de cualquier dimensión usando distancias euclidianas.

:::figura[Una relación circular: posición horizontal y vertical de 40 puntos sobre un anillo. Pearson es casi cero; la correlación de distancia detecta que las variables no son independientes.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: distancia
lecturas: [distancia, pearson]
generador:
  tipo: circulo
  n: 40
  ruido: 0.2
nombres:
  x: Coordenada x
  y: Coordenada y
```
:::

:::nota[Qué significa cada símbolo]
- $a_{ij}$, $b_{ij}$: distancia entre las observaciones $i$ y $j$ en $x$ y en $y$.
- $A_{ij}$, $B_{ij}$: distancias doblemente centradas (se les restan las medias de su fila y su columna y se suma la media general).
- $\bar{a}_{i\cdot}$, $\bar{a}_{\cdot j}$, $\bar{a}_{\cdot\cdot}$: medias de fila, de columna y general de las distancias.
- $\operatorname{dCov}^2$: covarianza de distancia al cuadrado.
- $\operatorname{dVar}^2$: varianza de distancia al cuadrado de cada variable.
- $\operatorname{dCor}$: correlación de distancia.
- $n$: número de observaciones.
:::

## Cómo usar la visualización

Los puntos relacionan el ángulo de 30 paneles respecto al óptimo con su pérdida de energía. El encabezado muestra la covarianza de distancia, las varianzas de distancia y la correlación de distancia resultante, junto con la correlación de Pearson. El panel compara también con Spearman.

Pearson y Spearman quedan cerca de cero porque la relación no es monótona; la correlación de distancia queda claramente por encima. Al arrastrar los puntos de un brazo de la U hacia una nube sin forma, la correlación de distancia baja. Con otra semilla, la U se mantiene y el resultado es parecido.

## Ejemplo

Tres paneles con ángulos $x = (-1, 0, 1)$ y pérdidas $y = (1, 0, 1)$: una U perfecta con $r = 0$.

1. Distancias en $x$: $a_{12} = 1$, $a_{13} = 2$, $a_{23} = 1$. Medias de fila: $1, 2/3, 1$; media general $8/9$.
2. Distancias centradas en $x$: $A_{11} = A_{33} \approx -1.111$, $A_{22} \approx -0.444$, $A_{12} = A_{23} \approx 0.222$, $A_{13} \approx 0.889$.
3. Distancias en $y$: $b_{12} = b_{23} = 1$, $b_{13} = 0$. Centradas: $B_{11} = B_{33} = B_{13} \approx -0.222$, $B_{22} \approx -0.889$, $B_{12} = B_{23} \approx 0.444$.
4. $\operatorname{dCov}^2 = \frac{1}{9}\sum A_{ij}B_{ij} \approx 0.889/9 \approx 0.0988$; $\operatorname{dVar}^2(x) \approx 0.4938$ y $\operatorname{dVar}^2(y) \approx 0.1975$.
5. $\operatorname{dCor} = \sqrt{0.0988/\sqrt{0.4938 \cdot 0.1975}} \approx \sqrt{0.0988/0.3123} \approx 0.562$, aunque $r = 0$.

:::figura[Los tres paneles del ejemplo: Pearson vale 0 y la correlación de distancia 0.562.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: distancia
lecturas: [distancia, pearson]
puntos: [[-1, 1], [0, 0], [1, 1]]
nombres:
  x: Ángulo respecto al óptimo
  y: Pérdida de energía
decimales: 0
```
:::

## Propiedades

- **Caracteriza la independencia:** en la población, $\operatorname{dCor}(X, Y) = 0$ si y solo si $X$ y $Y$ son independientes (con momentos finitos).
- **Rango:** $0 \le \operatorname{dCor} \le 1$; vale 1 si $y$ es una función lineal de $x$ (más precisamente, si existe una transformación de semejanza entre ellas).
- **No tiene signo:** no distingue relaciones crecientes de decrecientes.
- **Costo:** requiere las $n^2$ distancias, lo que la vuelve lenta para muestras muy grandes.

:::figura[Relación lineal exacta: el costo de un envío según el peso, sin ruido. La correlación de distancia vale 1, igual que Pearson.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: distancia
lecturas: [distancia, pearson]
generador:
  tipo: lineal
  n: 15
  ruido: 0
nombres:
  x: Peso del paquete
  y: Costo del envío
```
:::

## Errores comunes

- **Esperar cero en muestras de variables independientes.** La versión muestral es positiva casi siempre; con muestras pequeñas puede ser de 0.3 o más aunque no haya relación. Se evalúa con pruebas de permutación.
- **Compararla con Pearson en la misma escala.** Una correlación de distancia de 0.5 no equivale a un $r$ de 0.5.
- **Usarla para describir la forma de la relación.** Dice que hay dependencia, no cuál; siempre conviene mirar el diagrama.

:::figura[Sesgo con muestras pequeñas: 10 pares independientes. La correlación de distancia sale cerca de 0.3 o más; al cambiar la semilla oscila sin acercarse a cero.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: distancia
lecturas: [distancia, pearson]
generador:
  tipo: independiente
  n: 10
nombres:
  x: Variable A
  y: Variable B
```
:::

## Conexiones

La correlación de distancia generaliza la [[covarianza-muestral]] usando matrices de distancias, manejadas con las herramientas de [[matrices-y-operaciones-con-matrices]]. Se contrasta con el [[coeficiente-de-correlacion-de-pearson]], que solo detecta relaciones lineales, y con la [[correlacion-de-spearman]], que solo detecta monótonas. Otra medida de dependencia general es el [[coeficiente-de-informacion-maxima]], basado en información mutua.

## Formulario

:::formula[Centrado doble]
$$
A_{ij} = a_{ij} - \bar{a}_{i\cdot} - \bar{a}_{\cdot j} + \bar{a}_{\cdot\cdot}
$$

- $a_{ij} = |x_i - x_j|$: distancias; las barras indican medias de fila, columna y total.
:::

:::formula[Covarianza y varianza de distancia]
$$
\operatorname{dCov}^2(x, y) = \frac{1}{n^2}\sum_{i,j}A_{ij}B_{ij}, \qquad \operatorname{dVar}^2(x) = \frac{1}{n^2}\sum_{i,j}A_{ij}^2
$$

- $n$: número de observaciones.
:::

:::formula[Correlación de distancia]
$$
\operatorname{dCor}(x, y) = \sqrt{\frac{\operatorname{dCov}^2(x, y)}{\sqrt{\operatorname{dVar}^2(x)\,\operatorname{dVar}^2(y)}}}
$$

- Toma valores entre 0 y 1.
:::
