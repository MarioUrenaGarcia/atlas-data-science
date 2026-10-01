---
id: coeficiente-de-correlacion-de-pearson
titulo: Coeficiente de correlación de Pearson
titulo_en: Pearson correlation coefficient
alias:
  - correlación lineal
  - r de Pearson
  - coeficiente de correlación
modulo: 4
submodulo: '4.5'
orden: 2
nivel: basico
prerrequisitos:
  - covarianza-muestral
  - puntuaciones-z-muestrales
etiquetas:
  - asociación
  - correlación
  - relación lineal
  - r
resumen: >
  El coeficiente de Pearson divide la covarianza entre el producto de las desviaciones estándar. Vale
  entre -1 y 1 y mide qué tan bien se alinean los puntos sobre una recta.
formula: 'r = \frac{s_{xy}}{s_x\,s_y} = \frac{1}{n-1}\sum_{i=1}^{n} z_{x,i}\,z_{y,i}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: correlacion
    medida: pearson
    lecturas: [pearson, covarianza]
    generador:
      tipo: lineal
      n: 24
      ruido: 0.5
    nombres:
      x: Temperatura máxima
      y: Botellas de agua vendidas
    recta: true
referencias:
  - clave: degroot
  - clave: james-isl
    capitulo: '3'
publicado: true
---

## Intuición

La covarianza dice si dos variables crecen juntas, pero su valor depende de las unidades: cambia si la temperatura se mide en grados Fahrenheit o las ventas en cientos de botellas. Para saber qué tan fuerte es la relación hace falta una medida sin unidades. La solución es medir cada variable en desviaciones estándar, es decir, convertirla en puntuaciones z, y calcular la covarianza de esas puntuaciones. El resultado es el **coeficiente de correlación de Pearson**.

Al quitar las unidades, el coeficiente queda siempre entre $-1$ y $1$. Vale $1$ si todos los puntos están exactamente sobre una recta creciente, $-1$ si están sobre una recta decreciente, y valores cercanos a $0$ si no hay ninguna tendencia lineal. Los valores intermedios indican qué tan apretados están los puntos alrededor de una recta. Lo que no mide es la pendiente: una recta casi horizontal y una muy inclinada pueden tener el mismo $r$.

## Definición

:::definicion[Coeficiente de correlación de Pearson]
Para pares $(x_i, y_i)$ con desviaciones estándar $s_x, s_y > 0$,
$$
r = \frac{s_{xy}}{s_x\,s_y} = \frac{\sum_{i}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i}(x_i - \bar{x})^2}\,\sqrt{\sum_{i}(y_i - \bar{y})^2}}.
$$
Equivalentemente, $r = \frac{1}{n-1}\sum_i z_{x,i}\,z_{y,i}$, donde $z_{x,i}$ y $z_{y,i}$ son las puntuaciones z.
:::

Su versión poblacional es $\rho = \operatorname{Cov}(X, Y)/(\sigma_X \sigma_Y)$. Solo está definido si ninguna variable es constante.

:::figura[Ausencia de relación: la estatura de 30 personas y el último dígito de su número de teléfono. Los rectángulos positivos y negativos se equilibran y r queda cerca de cero.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: pearson
lecturas: [pearson]
generador:
  tipo: independiente
  n: 30
nombres:
  x: Estatura (escala 0 a 10)
  y: Último dígito del teléfono
```
:::

:::nota[Qué significa cada símbolo]
- $r$: coeficiente de correlación muestral.
- $s_{xy}$: covarianza muestral.
- $s_x, s_y$: desviaciones estándar muestrales.
- $x_i, y_i$: valores del par $i$; $\bar{x}, \bar{y}$: medias; $n$: número de pares.
- $z_{x,i}, z_{y,i}$: puntuaciones z de $x_i$ y $y_i$.
- $\rho$: correlación poblacional; $\sigma_X, \sigma_Y$: desviaciones estándar poblacionales.
:::

## Cómo usar la visualización

Los puntos relacionan la temperatura máxima de 24 días con las botellas de agua vendidas, en escalas de 0 a 10. La reproducción dibuja los rectángulos de productos uno por uno; al final, el encabezado divide la covarianza entre el producto de las desviaciones estándar. La recta es la de mínimos cuadrados.

Al arrastrar varios puntos hacia la recta, $r$ se acerca a 1; al dispersarlos, baja. Con un solo punto llevado a la esquina inferior derecha, $r$ cae de forma notable: el coeficiente es sensible a valores aislados. Con otra semilla cambian los datos, pero $r$ se mantiene en un rango parecido.

## Ejemplo

Con las horas de estudio (2, 4, 5, 7, 9) y las calificaciones (3, 4, 7, 6, 10) de cinco estudiantes:

1. Covarianza: $s_{xy} = 27/4 = 6.75$.
2. Desviaciones estándar: $s_x = \sqrt{29.2/4} \approx 2.702$ y $s_y = \sqrt{30/4} \approx 2.739$.
3. Correlación: $r = 6.75 / (2.702 \cdot 2.739) \approx 6.75/7.400 \approx 0.912$.
4. El valor es cercano a 1: los cinco puntos quedan bastante cerca de una recta creciente.
5. $r^2 \approx 0.832$: la recta de mínimos cuadrados explica cerca de 83 % de la variación de las calificaciones.

:::figura[Los cinco estudiantes del ejemplo con la recta ajustada: r = 0.912.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: pearson
lecturas: [pearson]
puntos: [[2, 3], [4, 4], [5, 7], [7, 6], [9, 10]]
nombres:
  x: Horas de estudio
  y: Calificación
recta: true
decimales: 0
```
:::

## Propiedades

- **Acotado:** $-1 \le r \le 1$, por la desigualdad de Cauchy-Schwarz.
- **Valores extremos:** $|r| = 1$ si y solo si los puntos están exactamente sobre una recta no horizontal.
- **Invariante ante cambios de escala positivos:** si $u = a + b x$ y $v = c + d y$ con $b\,d > 0$, entonces $r_{uv} = r_{xy}$; si $b\,d < 0$, cambia de signo.
- **Relación con la regresión:** la pendiente de mínimos cuadrados es $r\,s_y/s_x$, y $r^2$ es la proporción de varianza explicada por la recta.
- **Simetría:** $r_{xy} = r_{yx}$.

:::figura[Caso extremo: puntos sin ruido sobre una recta creciente. La correlación es exactamente 1 aunque la pendiente no lo sea.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: pearson
lecturas: [pearson]
generador:
  tipo: lineal
  n: 12
  ruido: 0
nombres:
  x: Kilómetros recorridos
  y: Costo del taxi
recta: true
```
:::

## Errores comunes

- **Confundir $r$ con la pendiente.** Una correlación de 0.9 no significa que $y$ aumente 0.9 unidades por cada unidad de $x$.
- **Usarlo con relaciones no lineales.** Una relación curva fuerte puede dar $r$ cercano a cero; siempre conviene mirar el diagrama de dispersión.
- **Ignorar los valores atípicos.** Un solo punto lejano puede crear o destruir una correlación alta.

:::figura[Correlación fabricada por un atípico: ocho tiendas sin relación entre publicidad y ventas, más una tienda grande en (20, 20). Ese único punto lleva r a 0.92; la correlación de Spearman, que usa rangos, queda en 0.48.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: pearson
lecturas: [pearson, spearman]
puntos: [[1, 5], [2, 3], [3, 6], [4, 4], [5, 5], [6, 4], [7, 6], [8, 5], [20, 20]]
nombres:
  x: Gasto en publicidad
  y: Ventas
recta: true
decimales: 0
```
:::

## Conexiones

El coeficiente estandariza la [[covarianza-muestral]] con las [[puntuaciones-z-muestrales]]. Sus alternativas basadas en rangos, la [[correlacion-de-spearman]] y la [[tau-de-kendall]], miden relaciones monótonas y resisten atípicos. Una correlación alta no indica causalidad, como se discute en [[correlacion-no-implica-causalidad]] y [[correlacion-espuria]]. En regresión lineal simple, $r^2$ es el coeficiente de determinación.

## Formulario

:::formula[Correlación de Pearson]
$$
r = \frac{s_{xy}}{s_x\,s_y}
$$

- $s_{xy}$: covarianza; $s_x, s_y$: desviaciones estándar.
:::

:::formula[Forma con puntuaciones z]
$$
r = \frac{1}{n-1}\sum_{i=1}^{n} z_{x,i}\,z_{y,i}, \qquad z_{x,i} = \frac{x_i - \bar{x}}{s_x}
$$

- $z_{x,i}, z_{y,i}$: valores estandarizados; $n$: número de pares.
:::

:::formula[Pendiente de mínimos cuadrados]
$$
b_1 = r\,\frac{s_y}{s_x}
$$

- $b_1$: pendiente de la recta de regresión de $y$ sobre $x$.
:::

:::formula[Coeficiente de determinación]
$$
R^2 = r^2
$$

- $R^2$: proporción de la varianza de $y$ explicada por la recta.
:::
