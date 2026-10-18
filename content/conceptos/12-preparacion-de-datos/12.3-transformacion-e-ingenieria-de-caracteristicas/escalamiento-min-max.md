---
id: escalamiento-min-max
titulo: Escalamiento min-max
titulo_en: Min-max scaling
alias:
  - normalización min-max
  - reescalamiento a [0, 1]
  - min-max normalization
modulo: 12
submodulo: '12.3'
orden: 1
nivel: basico
prerrequisitos:
  - rango
  - distancias
etiquetas:
  - escalamiento
  - preprocesamiento
  - distancias
  - ingeniería de características
resumen: >
  El escalamiento min-max lleva cada variable al intervalo [0, 1] restando su mínimo y dividiendo entre su
  rango, para que variables con unidades muy distintas pesen parecido en distancias y gradientes.
formula: "x' = \\frac{x - \\min x}{\\max x - \\min x}"
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: escalamiento
    metodo: minmax
    caso: clientes
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

Para recomendar productos, una tienda busca al cliente más parecido a Ana, que tiene 25 años y gana 21 mil pesos al mes. Si se mide la distancia directamente, una diferencia de 37 años de edad cuenta lo mismo que una diferencia de 37 pesos de ingreso. El ingreso, medido en miles, domina por completo: el "vecino más parecido" de Ana resulta ser Beto, de 62 años, solo porque gana 1500 pesos más.

El **escalamiento min-max** pone a cada variable en la misma regla: al valor más pequeño le asigna 0, al más grande 1, y a los demás su posición proporcional entre ambos. Después de escalar, una diferencia de 0.5 significa "la mitad del rango observado" en cualquier variable, sin importar si se medía en años o en pesos. El vecino de Ana pasa a ser alguien de edad e ingreso parecidos. Es la forma más simple de escalamiento y conserva la forma de la distribución; su debilidad es que los extremos fijan la escala, así que un solo valor muy alto comprime a todos los demás cerca de cero.

## Definición

:::definicion[Escalamiento min-max]
Para una variable con valores $x_1, \dots, x_n$, el **escalamiento min-max** al intervalo $[a, b]$ es

$$
x_i' = a + \frac{(x_i - \min x)(b - a)}{\max x - \min x},
$$

y en el caso usual $[a, b] = [0, 1]$, $x_i' = \dfrac{x_i - \min x}{\max x - \min x}$. El mínimo y el máximo se calculan con los datos de entrenamiento y se aplican sin cambios a los datos nuevos.
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor original de la observación $i$.
- $\min x$, $\max x$: menor y mayor valor de la variable en los datos de entrenamiento.
- $\max x - \min x$: rango de la variable.
- $a$, $b$: extremos del intervalo destino; por defecto $0$ y $1$.
- $x_i'$: valor escalado.
- $n$: número de observaciones.
:::

## Cómo usar la visualización

Los puntos son clientes con dos variables, dibujados con la misma escala en ambos ejes para que la distancia que se ve sea la distancia euclidiana real. El punto rojo es el cliente de consulta y la línea naranja lo une con su vecino más cercano. Al reproducir, los puntos se transforman de unidades originales a valores escalados y el vecino se recalcula. El encabezado muestra el escalamiento del ingreso del primer cliente.

Experimentos sugeridos: activar el valor extremo de la segunda variable y observar que el resto de los puntos se aplasta contra cero; cambiar a estandarización o a escalamiento robusto con el mismo extremo para comparar.

## Ejemplo

Diez clientes tienen edades entre 25 y 62 años e ingresos entre 15500 y 47000 pesos.

1. Ana: edad $(25 - 25)/(62 - 25) = 0$; ingreso $(21000 - 15500)/(47000 - 15500) = 5500/31500 = 0.175$.
2. Beto: edad $(62 - 25)/37 = 1$; ingreso $(22500 - 15500)/31500 = 0.222$.
3. Irma: edad $(29 - 25)/37 = 0.108$; ingreso $0$.
4. Distancia sin escalar: Ana a Beto $\sqrt{37^2 + 1500^2} = 1500.5$ y Ana a Irma $\sqrt{4^2 + 5500^2} = 5500.0$. El vecino de Ana es Beto.
5. Distancia escalada: Ana a Beto $\sqrt{1^2 + 0.047^2} = 1.001$ y Ana a Irma $\sqrt{0.108^2 + 0.175^2} = 0.205$. El vecino de Ana es Irma.

:::figura[Los diez clientes del ejemplo: en unidades originales el vecino de Ana es Beto; tras el escalamiento min-max es Irma.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: minmax
caso: clientes
```
:::

## Propiedades

- **Es una transformación lineal creciente.** Conserva el orden, la forma de la distribución y las correlaciones; solo cambia el origen y la unidad.
- **El rango escalado es exactamente $[0, 1]$ en entrenamiento.** Con datos nuevos puede haber valores menores que 0 o mayores que 1 si salen del rango observado.
- **Es sensible a los extremos.** Un solo valor muy grande fija $\max x$ y comprime el resto de los datos en una franja estrecha.

:::figura[Con una persona que gana 250 mil pesos, el máximo cambia y los demás ingresos escalados quedan entre 0 y 0.13: la variable deja de distinguir entre los clientes comunes.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: minmax
caso: clientes
atipico: true
```
:::

:::figura[Casas con superficie en metros cuadrados y número de recámaras: sin escalar, el vecino de la primera casa es la de superficie casi igual aunque tenga una recámara; tras escalar, pesa también el número de recámaras.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: minmax
caso: casas
```
:::

## Errores comunes

- **Calcular mínimo y máximo con todos los datos.** Si el rango incluye los datos de prueba, el modelo usa información que no tendría al predecir; se calcula con el entrenamiento y se reutiliza.
- **Escalar variables con valores extremos sin revisarlos.** Si el extremo es un error de captura, conviene corregirlo; si es real, el escalamiento robusto suele ser mejor opción.
- **Creer que escalar mejora cualquier modelo.** Los árboles de decisión dividen por umbrales y no cambian al escalar; donde importa es en métodos basados en distancias o en gradientes.

:::figura[Error de no revisar los extremos: estaturas y tiempos de atletas con un tiempo de 19.5 segundos; el resto de los tiempos escalados queda entre 0 y 0.28.]{componente="FeatureEngineeringViz"}
```yaml
modo: escalamiento
metodo: minmax
caso: atletas
atipico: true
```
:::

## Conexiones

El denominador es el [[rango]] de la variable y la motivación principal son las [[distancias]] entre observaciones, en particular la distancia euclidiana de las [[normas-vectoriales]]. Las alternativas son la [[estandarizacion]], que usa media y desviación estándar, y el [[escalamiento-robusto]], que usa mediana y rango intercuartílico. Escalar acelera el [[descenso-de-gradiente]] porque las curvas de nivel de la pérdida se vuelven menos alargadas.

## Formulario

:::formula[Escalamiento a [0, 1]]
$$
x' = \frac{x - \min x}{\max x - \min x}
$$

- $x$: valor original; $x'$: valor escalado.
- $\min x$, $\max x$: mínimo y máximo de entrenamiento.
:::

:::formula[Escalamiento a [a, b]]
$$
x' = a + \frac{(x - \min x)(b - a)}{\max x - \min x}
$$

- $a$, $b$: extremos del intervalo destino.
:::

:::formula[Distancia euclidiana entre dos observaciones]
$$
d(\mathbf{x}_i, \mathbf{x}_j) = \sqrt{\sum_{k=1}^{p} (x_{ik} - x_{jk})^2}
$$

- $d(\mathbf{x}_i, \mathbf{x}_j)$: distancia euclidiana entre las dos observaciones.
- $\mathbf{x}_i$, $\mathbf{x}_j$: vectores de las observaciones $i$ y $j$.
- $p$: número de variables; $x_{ik}$: variable $k$ de la observación $i$.
:::
