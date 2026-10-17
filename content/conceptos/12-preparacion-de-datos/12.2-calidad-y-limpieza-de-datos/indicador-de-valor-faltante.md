---
id: indicador-de-valor-faltante
titulo: Indicador de valor faltante
titulo_en: Missing value indicator
alias:
  - variable indicadora de faltante
  - bandera de faltante
  - missing indicator
modulo: 12
submodulo: '12.2'
orden: 11
nivel: basico
prerrequisitos:
  - imputacion-simple
  - funcion-indicadora-y-funcion-escalon
etiquetas:
  - datos faltantes
  - ingeniería de características
  - imputación
  - modelos predictivos
resumen: >
  Agregar una columna 0/1 que marca dónde faltaba un valor conserva la información de la ausencia después
  de imputar; en modelos predictivos, el hecho de no responder puede ser una señal útil.
formula: 'M_i = \mathbf{1}\{x_i \text{ falta}\}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: indicador
    tasa: 0.25
    efecto: 0.25
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

En las solicitudes de crédito de una financiera, una de cada cuatro personas deja vacío el campo de ingreso. Quienes lo omiten no son un grupo cualquiera: con frecuencia tienen ingresos irregulares o difíciles de comprobar, y dejan de pagar más que el resto. Si los huecos se llenan con el ingreso promedio, el modelo de riesgo ve a esas personas como solicitantes promedio y pierde justo la pista más reveladora: que no quisieron o no pudieron decir cuánto ganan.

El **indicador de valor faltante** es una columna nueva que vale 1 en las filas donde el valor faltaba y 0 donde se observó. Se agrega antes de imputar y se conserva junto a la columna imputada. Así el modelo puede aprender un ajuste propio para quienes no respondieron. La ausencia deja de ser un problema que se tapa y se convierte en un dato más. El método no corrige los sesgos de estimación de los parámetros cuando se busca describir a la población, pero en tareas de predicción suele mejorar el desempeño cuando la ausencia está relacionada con el resultado.

## Definición

:::definicion[Indicador de valor faltante]
Para una variable $x$ con faltantes, el **indicador** es

$$
M_i = \mathbf{1}\{x_i \text{ falta}\} = \begin{cases} 1 & \text{si } x_i \text{ falta,} \\ 0 & \text{si } x_i \text{ se observa.} \end{cases}
$$

Se usa junto con la variable imputada $\tilde{x}_i$; en una regresión logística, por ejemplo,

$$
P(Y_i = 1) = \sigma(\beta_0 + \beta_1 \tilde{x}_i + \gamma M_i).
$$
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor original de la variable en la fila $i$, posiblemente faltante.
- $M_i$: indicador de faltante de la fila $i$.
- $\mathbf{1}\{\cdot\}$: función indicadora.
- $\tilde{x}_i$: valor después de imputar (igual a $x_i$ si se observó).
- $Y_i$: resultado binario, por ejemplo $1$ si la persona no paga.
- $\sigma$: función logística.
- $\beta_0$, $\beta_1$: intercepto y efecto de la variable imputada.
- $\gamma$: diferencia en la escala logit entre quienes omitieron el dato y quienes lo reportaron, con la misma $\tilde{x}$.
:::

## Cómo usar la visualización

La animación avanza por etapas. Primero aparece la tabla con ingresos vacíos; luego se imputan con la media; después se agrega la columna $M$; al final se ajustan dos modelos de impago, sin y con el indicador. Las barras comparan la tasa real de impago de quienes reportan y de quienes omiten el ingreso con la probabilidad promedio que cada modelo asigna a estos últimos.

Experimentos sugeridos: poner el riesgo adicional en 0 y observar que el coeficiente del indicador se acerca a cero; subirlo a 0.4 y ver que el modelo sin indicador subestima el impago de quienes omiten el ingreso.

## Ejemplo

De 200 solicitantes, 160 reportan su ingreso y 24 de ellos no pagan (15 %); 40 lo omiten y 14 no pagan (35 %).

1. Imputando la media sin indicador, los 40 se tratan como solicitantes de ingreso promedio, con probabilidad cercana a la de ese grupo, alrededor de 15 %.
2. Con un modelo que solo usa el indicador, $\hat\beta_0 = \operatorname{logit}(0.15) = \log(0.15/0.85) = -1.735$.
3. $\hat\beta_0 + \hat\gamma = \operatorname{logit}(0.35) = \log(0.35/0.65) = -0.619$, así que $\hat\gamma = -0.619 - (-1.735) = 1.116$.
4. La razón de momios es $e^{1.116} = 3.05$: omitir el ingreso triplica los momios de no pagar.

:::figura[Con 25 % de ingresos faltantes y riesgo adicional de 0.25, el modelo con indicador asigna a quienes omiten el ingreso una probabilidad cercana a su tasa real; el modelo sin indicador la subestima.]{componente="DataQualityTable"}
```yaml
modo: indicador
tasa: 0.25
efecto: 0.25
```
:::

## Propiedades

- **Si la ausencia no predice el resultado, el indicador no estorba.** Su coeficiente se acerca a cero y la pérdida del modelo apenas cambia.

:::figura[Sin riesgo adicional, el coeficiente del indicador es cercano a cero y los dos modelos predicen casi lo mismo.]{componente="DataQualityTable"}
```yaml
modo: indicador
tasa: 0.25
efecto: 0
```
:::

- **Es más útil cuanto más se relaciona la ausencia con el resultado**, lo que ocurre a menudo cuando los faltantes son MNAR.
- **Agrega una columna por cada variable con faltantes.** Con muchas variables conviene agregar indicadores solo donde la proporción de faltantes es apreciable.

:::figura[Con 40 % de faltantes y riesgo adicional de 0.4, la diferencia entre los dos modelos es mayor y la pérdida logarítmica baja al agregar el indicador.]{componente="DataQualityTable"}
```yaml
modo: indicador
tasa: 0.4
efecto: 0.4
```
:::

## Errores comunes

- **Usarlo para estimar efectos en la población.** En un modelo explicativo, el indicador con imputación por la media puede sesgar los coeficientes de las demás variables; para describir o estimar efectos se prefiere la imputación múltiple.
- **Crear el indicador después de imputar.** Una vez rellenados los huecos ya no se sabe cuáles eran; el indicador se calcula antes.
- **Olvidarlo al usar el modelo.** Si en producción el valor faltante se llena de otra forma o el indicador no se calcula, el modelo recibe datos distintos de los que vio al entrenar.

## Conexiones

El indicador es una [[funcion-indicadora-y-funcion-escalon|función indicadora]] de la matriz de faltantes descrita en los [[mecanismos-de-datos-faltantes]], y se combina con la [[imputacion-simple]] de la variable original. El modelo de la visualización usa la [[funcion-sigmoide-y-funcion-softplus|función sigmoide]], y el efecto del indicador se interpreta como en las [[pruebas-diagnosticas]], comparando dos grupos por su tasa del resultado. Para estimar parámetros de la población, la alternativa es la [[imputacion-multiple]].

## Formulario

:::formula[Indicador de faltante]
$$
M_i = \mathbf{1}\{x_i \text{ falta}\}
$$

- $x_i$: valor original; $M_i$: vale $1$ si falta y $0$ si se observa.
:::

:::formula[Modelo con indicador]
$$
P(Y_i = 1) = \sigma(\beta_0 + \beta_1 \tilde{x}_i + \gamma M_i)
$$

- $\tilde{x}_i$: valor imputado.
- $\gamma$: efecto de que el valor faltara, en escala logit.
- $\sigma$: función logística.
:::

:::formula[Logit de una proporción]
$$
\operatorname{logit}(p) = \log\frac{p}{1 - p}
$$

- $p$: proporción o probabilidad.
- La diferencia de logits entre dos grupos es $\gamma$, y $e^{\gamma}$ es la razón de momios.
:::
