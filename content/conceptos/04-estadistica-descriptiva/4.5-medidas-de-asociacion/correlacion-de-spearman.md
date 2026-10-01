---
id: correlacion-de-spearman
titulo: Correlación de Spearman
titulo_en: Spearman's rank correlation
alias:
  - rho de Spearman
  - correlación de rangos
modulo: 4
submodulo: '4.5'
orden: 3
nivel: basico
prerrequisitos:
  - coeficiente-de-correlacion-de-pearson
  - cuantiles-cuartiles-deciles-y-percentiles
etiquetas:
  - asociación
  - rangos
  - relación monótona
  - estadística robusta
resumen: >
  La correlación de Spearman es la correlación de Pearson calculada sobre los rangos de los datos.
  Mide qué tan monótona es la relación, aunque no sea lineal, y resiste valores atípicos.
formula: 'r_s = r\big(\operatorname{rango}(x), \operatorname{rango}(y)\big) = 1 - \frac{6\sum_{i} d_i^2}{n(n^2 - 1)}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: correlacion
    medida: spearman
    lecturas: [spearman, pearson]
    generador:
      tipo: exponencial
      n: 12
      ruido: 0.08
    nombres:
      x: Dosis de fertilizante
      y: Crecimiento de la planta
referencias:
  - clave: agresti
  - clave: wasserman
publicado: true
---

## Intuición

Un agrónomo prueba dosis crecientes de fertilizante y observa que las plantas siempre crecen más con más fertilizante, pero no de manera proporcional: al principio el efecto es pequeño y después se dispara. La relación es perfectamente creciente, aunque no forma una recta, así que la correlación de Pearson queda por debajo de 1.

La **correlación de Spearman** responde a otra pregunta: ¿el orden de una variable coincide con el orden de la otra? Para ello reemplaza cada valor por su lugar en la lista ordenada, su **rango**, y calcula la correlación de Pearson con esos rangos. Si la planta con la dosis más baja es la que menos creció, la de la segunda dosis la segunda que menos creció, y así sucesivamente, los rangos coinciden y la correlación es exactamente 1, sin importar la forma de la curva. Como los rangos no dependen de qué tan lejos está un valor extremo, sino solo de su posición, el coeficiente resiste los valores atípicos.

## Definición

:::definicion[Correlación de Spearman]
Sean $R_i$ el rango de $x_i$ entre las $x$ y $S_i$ el rango de $y_i$ entre las $y$ (con empates, el promedio de los rangos empatados). La **correlación de Spearman** es la correlación de Pearson de los rangos:
$$
r_s = r(R, S).
$$
Si no hay empates, se simplifica a
$$
r_s = 1 - \frac{6\sum_{i=1}^{n} d_i^2}{n(n^2 - 1)}, \qquad d_i = R_i - S_i.
$$
:::

Vale $1$ si la relación es estrictamente creciente, $-1$ si es estrictamente decreciente y está entre ambos en cualquier otro caso. Solo requiere que las variables sean al menos ordinales.

:::figura[Rangos de una relación decreciente: velocidad media y tiempo de llegada de 10 ciclistas. La reproducción transforma los valores en rangos y el resultado es una línea casi perfecta.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: spearman
lecturas: [spearman, pearson]
generador:
  tipo: lineal
  n: 10
  ruido: 0.3
  pendiente: -1
nombres:
  x: Velocidad media
  y: Tiempo de llegada
```
:::

:::nota[Qué significa cada símbolo]
- $r_s$: correlación de Spearman.
- $R_i$: rango de $x_i$ (1 para el menor valor de $x$, $n$ para el mayor).
- $S_i$: rango de $y_i$.
- $r(R, S)$: correlación de Pearson calculada con los rangos.
- $d_i = R_i - S_i$: diferencia entre los rangos de la observación $i$.
- $n$: número de pares.
:::

## Cómo usar la visualización

Los 12 puntos relacionan la dosis de fertilizante con el crecimiento, una relación creciente pero curva. Al principio el encabezado muestra los rangos de $x$; después cada punto se desplaza hasta sus coordenadas en rangos, y la curva se convierte en una nube casi recta. El panel compara la correlación de Spearman con la de Pearson.

Si la relación es exactamente monótona, los puntos en rangos quedan sobre la diagonal y $r_s = 1$, mientras que Pearson es menor. Al arrastrar un punto (antes de la transformación) muy arriba, Pearson cambia mucho más que Spearman, porque ese punto solo puede subir un rango.

## Ejemplo

Cinco atletas registran sus horas de entrenamiento semanal y su marca en salto largo:

| Atleta | Horas | Marca (m) | Rango horas | Rango marca | $d$ |
| --- | --- | --- | --- | --- | --- |
| A | 2 | 11.0 | 2 | 2 | 0 |
| B | 5 | 12.5 | 4 | 3 | 1 |
| C | 1 | 10.8 | 1 | 1 | 0 |
| D | 8 | 13.9 | 5 | 5 | 0 |
| E | 4 | 12.6 | 3 | 4 | -1 |

1. Suma de diferencias al cuadrado: $\sum d_i^2 = 0 + 1 + 0 + 0 + 1 = 2$.
2. $r_s = 1 - \frac{6 \cdot 2}{5(25 - 1)} = 1 - \frac{12}{120} = 0.9$.
3. Solo dos atletas intercambian lugares; el orden es casi el mismo.

:::figura[Los cinco atletas del ejemplo: al transformarlos a rangos, solo B y E se separan de la diagonal.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: spearman
lecturas: [spearman, pearson]
puntos: [[2, 11.0], [5, 12.5], [1, 10.8], [8, 13.9], [4, 12.6]]
nombres:
  x: Horas de entrenamiento
  y: Marca en salto largo
```
:::

## Propiedades

- **Invariante ante transformaciones crecientes:** aplicar logaritmos, raíces o cualquier función creciente a $x$ o a $y$ no cambia $r_s$.
- **Resistente:** un valor extremo solo puede alterar su propio rango, por lo que su efecto está acotado.
- **Mide monotonía, no linealidad:** $r_s = 1$ para cualquier relación estrictamente creciente.
- **Con empates** se usan rangos promedio y la fórmula con $d_i^2$ deja de ser exacta; se calcula como Pearson de los rangos.

:::figura[Invariancia: cinco ciudades con población (en rangos de 1 a 5) y número de hospitales que crece de forma muy desigual. Pearson es 0.92, pero el orden coincide exactamente y Spearman es 1.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: spearman
lecturas: [spearman, pearson]
puntos: [[3, 12], [1, 8], [4, 30], [2, 9], [5, 50]]
nombres:
  x: Tamaño de la ciudad
  y: Número de hospitales
decimales: 0
```
:::

## Errores comunes

- **Creer que detecta cualquier relación.** Una relación en forma de U no es monótona y da $r_s$ cercano a cero.
- **Aplicar la fórmula de $d_i^2$ con muchos empates.** Con empates frecuentes hay que usar la correlación de Pearson de los rangos promedio.
- **Interpretarlo como Pearson.** Un $r_s$ alto dice que el orden se conserva, no que la relación sea lineal.

:::figura[Relación no monótona: rendimiento de un empleado contra su nivel de estrés, máximo con estrés intermedio. Los rangos no se alinean y Spearman queda cerca de cero.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: spearman
lecturas: [spearman, pearson]
puntos: [[-3, 1], [-2, 6], [-1, 9], [0, 10], [1, 9], [2, 6], [3, 1]]
nombres:
  x: Nivel de estrés (centrado)
  y: Rendimiento
decimales: 0
```
:::

## Conexiones

La correlación de Spearman es el [[coeficiente-de-correlacion-de-pearson]] aplicado a rangos, una idea cercana a los [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]], que también dependen solo del orden. La [[tau-de-kendall]] mide la misma idea de concordancia contando pares. Para detectar relaciones que no son monótonas existen la [[correlacion-de-distancia]] y el [[coeficiente-de-informacion-maxima]].

## Formulario

:::formula[Spearman como Pearson de rangos]
$$
r_s = r(R, S)
$$

- $R, S$: rangos de $x$ y de $y$.
:::

:::formula[Fórmula sin empates]
$$
r_s = 1 - \frac{6\sum_{i=1}^{n} d_i^2}{n(n^2 - 1)}
$$

- $d_i$: diferencia de rangos de la observación $i$.
- $n$: número de pares.
:::
