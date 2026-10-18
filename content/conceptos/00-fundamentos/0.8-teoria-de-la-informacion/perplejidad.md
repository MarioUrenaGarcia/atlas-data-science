---
id: perplejidad
titulo: Perplejidad
titulo_en: Perplexity
alias:
  - PP
  - perplexity
  - número efectivo de opciones
modulo: 0
submodulo: '0.8'
orden: 14
nivel: intermedio
prerrequisitos:
  - entropia-cruzada
etiquetas:
  - perplejidad
  - modelos de lenguaje
  - evaluación de modelos
  - teoría de la información
resumen: >
  La perplejidad es 2 elevado a la entropía cruzada promedio de un modelo sobre datos de prueba. Se
  lee como el número efectivo de opciones entre las que el modelo duda en cada paso.
formula: '\mathrm{PP} = 2^{-\frac{1}{N}\sum_{i=1}^{N} \log_2 q(x_i)} = \Big(\prod_{i=1}^{N} q(x_i)\Big)^{-1/N}'
visualizacion:
  componente: InformationViz
  parametros:
    modo: perplejidad
    p: [0.5, 0.25, 0.15, 0.1]
    q: [0.4, 0.3, 0.2, 0.1]
    semilla: 7
referencias:
  - clave: murphy
  - clave: cover-thomas
publicado: true
---

## Intuición

Un teclado de celular predice la siguiente palabra. Si el modelo dudara siempre entre cuatro palabras igual de probables, cada predicción sería como lanzar un dado de cuatro caras. La perplejidad traduce la calidad de cualquier modelo a ese lenguaje: el número de caras de un dado justo que sería igual de incierto que el modelo frente a los datos.

Se calcula a partir de las probabilidades que el modelo asignó a lo que realmente ocurrió. Si esas probabilidades son altas, el modelo estaba poco perplejo y el número es pequeño; si asignó probabilidades bajas a lo observado, el número crece. Matemáticamente es 2 elevado a la sorpresa promedio, que es la entropía cruzada empírica, o lo que es lo mismo, el inverso de la media geométrica de las probabilidades asignadas.

Su mínimo, con infinitos datos, es $2^{H(p)}$: ni el mejor modelo posible puede ser menos perplejo que la incertidumbre propia de los datos.

## Definición

:::definicion[Perplejidad]
Sea $q$ un modelo que asigna probabilidades a las observaciones $x_1, \dots, x_N$. Su perplejidad sobre esos datos es
$$
\mathrm{PP}(q) = 2^{-\frac{1}{N}\sum_{i=1}^{N}\log_2 q(x_i)} = \Big(\prod_{i=1}^{N} q(x_i)\Big)^{-1/N}.
$$
Para un modelo secuencial, $q(x_i)$ es la probabilidad condicional $q(x_i \mid x_1, \dots, x_{i-1})$. Si las observaciones vienen de $p$, cuando $N \to \infty$,
$$
\mathrm{PP}(q) \to 2^{H(p, q)} \ge 2^{H(p)}.
$$
:::

:::nota[Qué significa cada símbolo]
- $q$: modelo que se evalúa.
- $x_1, \dots, x_N$: observaciones de prueba; $N$: su número.
- $q(x_i)$: probabilidad que el modelo asignó a la observación $i$.
- $\mathrm{PP}(q)$: perplejidad del modelo.
- $p$: distribución que genera los datos.
- $H(p, q)$: entropía cruzada; $H(p)$: entropía de los datos.
:::

## Cómo usar la visualización

Se extraen observaciones de la distribución verdadera $p$, una por cuadro, hasta 400. La curva de un color es la perplejidad acumulada del modelo $q$ y la otra, la de la propia $p$, que hace de modelo ideal. Las líneas punteadas son los límites $2^{H(p, q)}$ y $2^{H(p)}$. La semilla cambia la secuencia de observaciones.

Con las primeras observaciones las curvas oscilan; después se asientan. Con la semilla 7, tras 400 observaciones el modelo marca 3.481 y la distribución verdadera 3.441, cerca de los límites 3.424 y 3.347. A partir de unas 110 observaciones la curva del modelo queda por encima de la verdadera, como debe ocurrir en el límite: con cuatro valores posibles, el modelo duda en promedio entre unas 3.4 opciones.

## Ejemplo

Un modelo de lenguaje asigna a las cuatro palabras de una frase de prueba las probabilidades 0.2, 0.1, 0.5 y 0.05.

1. Sorpresas: $-\log_2 0.2 = 2.322$, $-\log_2 0.1 = 3.322$, $-\log_2 0.5 = 1$ y $-\log_2 0.05 = 4.322$ bits.
2. Promedio: $(2.322 + 3.322 + 1 + 4.322)/4 = 2.741$ bits por palabra.
3. Perplejidad: $2^{2.741} = 6.69$.
4. Con la media geométrica: $(0.2 \cdot 0.1 \cdot 0.5 \cdot 0.05)^{-1/4} = 0.0005^{-1/4} = 6.69$.

El modelo es tan incierto como si eligiera al azar entre unas 6.7 palabras en cada paso.

:::figura[Un modelo que invierte las probabilidades reales, (0.1, 0.2, 0.3, 0.4) contra (0.4, 0.3, 0.2, 0.1): su perplejidad se asienta cerca de 5.6, más que los 4 de adivinar al azar, frente a 3.6 de la distribución verdadera.]{componente="InformationViz"}
```yaml
modo: perplejidad
p: [0.4, 0.3, 0.2, 0.1]
q: [0.1, 0.2, 0.3, 0.4]
semilla: 7
```
:::

## Propiedades

- **Rango:** $\mathrm{PP} \ge 1$, con igualdad solo si el modelo asignó probabilidad 1 a cada observación.
- **Modelo uniforme:** un modelo que da probabilidad $1/k$ a cada uno de $k$ valores tiene perplejidad exactamente $k$ sobre cualquier dato.

:::figura[Datos con probabilidades (0.5, 0.25, 0.15, 0.1) y un modelo uniforme: su perplejidad es 4 desde la primera observación y no se mueve, mientras la de la distribución verdadera marca 3.441 tras 400 observaciones, en camino a su límite de 3.347.]{componente="InformationViz"}
```yaml
modo: perplejidad
p: [0.5, 0.25, 0.15, 0.1]
q: [1, 1, 1, 1]
semilla: 7
```
:::

- **Relación con la entropía cruzada:** $\log_2 \mathrm{PP} = \hat{H}(p, q)$, así que minimizar la perplejidad equivale a minimizar la pérdida de entropía cruzada.
- **Cota inferior asintótica:** $\mathrm{PP}(q) \to 2^{H(p) + D_{\mathrm{KL}}(p \,\|\, q)}$; la perplejidad mínima, $2^{H(p)}$, se alcanza solo con $q = p$.
- **Base del logaritmo:** el resultado no depende de la base si se usa la misma para el exponente: $e^{\hat{H}_{\text{nats}}} = 2^{\hat{H}_{\text{bits}}}$.

## Errores comunes

- **Comparar perplejidades de modelos con vocabularios distintos.** Si un modelo divide el texto en más piezas, cada predicción es más fácil y la perplejidad por pieza baja sin que el modelo sea mejor.
- **Medirla en los datos de entrenamiento.** Un modelo que memoriza tiene perplejidad baja en lo que ya vio y alta en datos nuevos; se evalúa siempre en datos de prueba.
- **Leerla como porcentaje de error.** Una perplejidad de 20 no significa equivocarse 20 % de las veces, sino dudar como entre 20 opciones equiprobables.
- **Confiar en pocas observaciones.** Con pocos datos la perplejidad empírica oscila; con la semilla 7 y el modelo de la visualización principal vale 3.219 tras 50 observaciones y 3.481 tras 400.

:::figura[Semilla 3: tras 20 observaciones el modelo marca 3.355 y la distribución verdadera 3.395, como si el modelo fuera mejor; tras 400 el orden se corrige, 3.514 contra 3.493.]{componente="InformationViz"}
```yaml
modo: perplejidad
p: [0.5, 0.25, 0.15, 0.1]
q: [0.4, 0.3, 0.2, 0.1]
semilla: 3
```
:::


## Conexiones

Es la exponencial de la [[entropia-cruzada]] empírica y por eso hereda su descomposición en [[entropia-de-shannon]] más [[divergencia-de-kullback-leibler]]. Su interpretación como número de opciones viene del [[contenido-de-informacion]]: un evento con sorpresa de $b$ bits es tan raro como acertar entre $2^b$ opciones.

## Formulario

:::formula[Perplejidad]
$$
\mathrm{PP}(q) = 2^{-\frac{1}{N}\sum_{i=1}^{N}\log_2 q(x_i)}
$$

- $q(x_i)$: probabilidad que el modelo asignó a la observación $i$; $N$: número de observaciones.
:::

:::formula[Media geométrica]
$$
\mathrm{PP}(q) = \Big(\prod_{i=1}^{N} q(x_i)\Big)^{-1/N}
$$

- Inverso de la media geométrica de las probabilidades asignadas.
:::

:::formula[Límite]
$$
\mathrm{PP}(q) \to 2^{H(p, q)} = 2^{H(p) + D_{\mathrm{KL}}(p \,\|\, q)}
$$

- $p$: distribución de los datos; $H(p, q)$: entropía cruzada; $H(p)$: entropía; $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler.
:::
