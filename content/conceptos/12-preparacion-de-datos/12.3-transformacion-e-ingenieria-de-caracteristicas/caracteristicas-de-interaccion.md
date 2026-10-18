---
id: caracteristicas-de-interaccion
titulo: Características de interacción
titulo_en: Interaction features
alias:
  - términos de interacción
  - productos de variables
  - efectos de interacción
modulo: 12
submodulo: '12.3'
orden: 13
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - diagrama-de-dispersion
etiquetas:
  - ingeniería de características
  - interacción
  - modelos lineales
  - efectos condicionales
resumen: >
  Una característica de interacción es el producto de dos variables. Permite que un modelo lineal estime
  que el efecto de una variable cambia según el valor de otra, algo que la suma de efectos no puede expresar.
formula: '\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \beta_3 x_1 x_2'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: interaccion
    conInteraccion: false
    efecto: 2
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

Una cadena de heladerías invierte en publicidad todo el año. En temporada baja, cada mil pesos de publicidad suben las ventas 2 mil pesos; en temporada alta, cuando la gente ya busca helado, la misma publicidad las sube 4 mil. El efecto de la publicidad depende de la temporada.

Un modelo lineal con publicidad y temporada como variables separadas solo puede decir "la publicidad aumenta las ventas en tanto y la temporada alta suma una cantidad fija": dos rectas paralelas, con la misma pendiente en ambas temporadas. Para que la pendiente cambie hace falta una variable nueva, el **producto** de publicidad por la indicadora de temporada alta. Esa columna vale cero en temporada baja y vale el gasto en publicidad en temporada alta, así que su coeficiente es justo lo que la pendiente aumenta en la temporada alta. Construir productos de variables es la forma de enseñar a un modelo lineal que "depende".

## Definición

:::definicion[Característica de interacción]
Dadas dos variables $x_1$ y $x_2$, su **característica de interacción** es el producto $x_1 x_2$. En un modelo lineal

$$
\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \beta_3\, x_1 x_2,
$$

el efecto de $x_1$ ya no es constante: $\dfrac{\partial \hat{y}}{\partial x_1} = \beta_1 + \beta_3 x_2$. Si $x_2$ es una indicadora, la pendiente de $x_1$ es $\beta_1$ cuando $x_2 = 0$ y $\beta_1 + \beta_3$ cuando $x_2 = 1$.
:::

:::nota[Qué significa cada símbolo]
- $x_1$: primera variable, por ejemplo gasto en publicidad.
- $x_2$: segunda variable, por ejemplo indicadora de temporada alta.
- $x_1 x_2$: producto de ambas, la característica de interacción.
- $\hat{y}$: predicción del modelo.
- $\beta_0$: intercepto.
- $\beta_1$: efecto de $x_1$ cuando $x_2 = 0$.
- $\beta_2$: diferencia de nivel cuando $x_2 = 1$ y $x_1 = 0$.
- $\beta_3$: cambio en el efecto de $x_1$ por cada unidad de $x_2$.
- $\partial \hat{y} / \partial x_1$: efecto de aumentar $x_1$ en una unidad.
:::

## Cómo usar la visualización

Cada punto es una semana de ventas: azul en temporada baja y naranja en temporada alta. Al reproducir aparecen las semanas y el modelo se reajusta con las que van llegando. Sin la característica de interacción, las dos rectas son paralelas; con ella, cada temporada tiene su pendiente. El encabezado muestra la ecuación ajustada y las lecturas comparan las pendientes y la R cuadrada de ambos modelos.

Experimentos sugeridos: activar la interacción y ver que las rectas se abren; poner el efecto adicional en 0 y comprobar que la interacción casi no mejora la R cuadrada; hacerlo negativo para que la publicidad funcione peor en temporada alta.

## Ejemplo

El modelo verdadero es $y = 20 + 2x_1 + 5x_2 + 2x_1x_2$, en miles de pesos.

1. Temporada baja ($x_2 = 0$): $y = 20 + 2x_1$. Con $x_1 = 5$: $y = 30$.
2. Temporada alta ($x_2 = 1$): $y = 25 + 4x_1$. Con $x_1 = 5$: $y = 45$.
3. Efecto de mil pesos más de publicidad: $\beta_1 + \beta_3 x_2$, es decir 2 en baja y 4 en alta.
4. Un modelo sin interacción estimaría una sola pendiente, intermedia entre 2 y 4, y se equivocaría de manera sistemática en ambas temporadas: subestimaría el efecto en alta y lo sobreestimaría en baja.

:::figura[El mismo ejemplo con la característica de interacción: cada temporada tiene su propia pendiente, cercana a 2 y a 4.]{componente="FeatureEngineeringViz"}
```yaml
modo: interaccion
conInteraccion: true
efecto: 2
```
:::

## Propiedades

- **Sigue siendo un modelo lineal en los coeficientes.** La interacción es una columna más; se ajusta con mínimos cuadrados como cualquier otra.
- **Con una indicadora, equivale a ajustar una recta por grupo**, pero en un solo modelo que comparte la estimación del error.
- **Los efectos principales cambian de significado.** Con interacción, $\beta_1$ es el efecto de $x_1$ solo cuando $x_2 = 0$, no un efecto promedio.

:::figura[Cuando la publicidad funciona peor en temporada alta, el coeficiente de interacción es negativo y la recta naranja es más plana.]{componente="FeatureEngineeringViz"}
```yaml
modo: interaccion
conInteraccion: true
efecto: -1.5
```
:::

## Errores comunes

- **Incluir la interacción sin los efectos principales.** Un modelo con $x_1 x_2$ pero sin $x_1$ o sin $x_2$ obliga a que las rectas pasen por puntos arbitrarios; casi siempre se incluyen los tres términos.
- **Agregar todas las interacciones posibles.** Con $p$ variables hay $p(p - 1)/2$ productos de pares; agregarlos todos multiplica las columnas y el riesgo de sobreajuste.
- **Leer $\beta_1$ como el efecto general de $x_1$.** En presencia de interacción, el efecto depende de $x_2$ y debe reportarse para cada valor relevante.

:::figura[Error de agregar la interacción cuando no existe: con efecto adicional nulo, el coeficiente de interacción queda cerca de cero y la R cuadrada casi no mejora.]{componente="FeatureEngineeringViz"}
```yaml
modo: interaccion
conInteraccion: true
efecto: 0
```
:::

## Conexiones

Las interacciones son el caso de grado dos de las [[caracteristicas-polinomiales]]. Con una variable categórica, la interacción usa las columnas de la [[codificacion-one-hot]]. El efecto condicional es una [[derivadas-parciales|derivada parcial]] que depende de la otra variable, y la relación distinta por grupo se ve en un [[diagrama-de-dispersion]] coloreado por grupo. La [[paradoja-de-simpson]] muestra otra forma en que una tercera variable cambia la relación entre dos.

## Formulario

:::formula[Modelo con interacción]
$$
\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \beta_3\, x_1 x_2
$$

- $x_1 x_2$: característica de interacción.
- $\beta_3$: coeficiente de interacción.
:::

:::formula[Efecto condicional de x1]
$$
\frac{\partial \hat{y}}{\partial x_1} = \beta_1 + \beta_3 x_2
$$

- El efecto de $x_1$ depende del valor de $x_2$.
:::

:::formula[Número de interacciones de pares]
$$
\binom{p}{2} = \frac{p(p - 1)}{2}
$$

- $p$: número de variables originales.
:::
