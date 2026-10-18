---
id: codificacion-por-frecuencia
titulo: Codificación por frecuencia
titulo_en: Frequency encoding
alias:
  - count encoding
  - codificación por conteo
  - frequency encoding
modulo: 12
submodulo: '12.3'
orden: 10
nivel: basico
prerrequisitos:
  - codificacion-one-hot
etiquetas:
  - variables categóricas
  - codificación
  - frecuencia relativa
  - ingeniería de características
resumen: >
  La codificación por frecuencia reemplaza cada categoría por la proporción (o el número) de filas en que
  aparece. Es compacta y no usa la variable objetivo, pero confunde categorías con la misma frecuencia.
formula: '\tilde{x}_c = \frac{n_c}{n}'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: frecuencia
    caso: marcas
referencias:
  - clave: hastie-esl
publicado: true
---

## Intuición

En un catálogo de autos usados, la marca puede ser informativa de una forma indirecta: las marcas muy comunes tienen refacciones baratas y mucha demanda, y las raras se venden más lento. Una manera sencilla de llevar esa información a un número es contar cuántas veces aparece cada marca y usar esa proporción como variable. Una marca con el 33 % de los anuncios recibe 0.33; una con dos anuncios en todo el catálogo, 0.012.

La **codificación por frecuencia** tiene dos ventajas: produce una sola columna y no usa la variable objetivo, así que no puede filtrar la respuesta. Su limitación es que solo conserva la popularidad de cada categoría. Dos marcas con el mismo número de anuncios reciben exactamente el mismo código, aunque una cueste el doble que la otra; para el modelo se vuelven indistinguibles. Funciona bien cuando la frecuencia está relacionada con lo que se quiere predecir y como complemento de otras codificaciones.

## Definición

:::definicion[Codificación por frecuencia]
Sea $c$ una categoría que aparece $n_c$ veces entre $n$ filas de entrenamiento. Su **código por frecuencia** es

$$
\tilde{x}_c = \frac{n_c}{n},
$$

o simplemente $n_c$ en la versión por conteo. Las categorías nuevas, que no aparecieron en el entrenamiento, reciben $0$ o un valor fijo para categorías desconocidas.
:::

:::nota[Qué significa cada símbolo]
- $c$: categoría.
- $n_c$: número de filas de entrenamiento con la categoría $c$.
- $n$: número total de filas de entrenamiento.
- $\tilde{x}_c$: código de la categoría, entre $0$ y $1$.
:::

## Cómo usar la visualización

Las filas del catálogo se cuentan una por una en la barra de su marca. La altura de cada barra es la proporción de filas que lleva contadas, y al terminar es el código por frecuencia. Al final, las marcas que comparten el mismo número de filas se pintan de naranja: tienen el mismo código. La tabla de datos al pie muestra también el precio medio de cada marca, que el código no distingue.

Experimento sugerido: comparar en la tabla las marcas D y E, con el mismo número de anuncios y precios medios muy distintos.

## Ejemplo

Un catálogo tiene 166 anuncios de ocho marcas, con 55, 45, 30, 14, 14, 4, 2 y 2 anuncios.

1. Marca A: $55/166 = 0.331$. Marca B: $45/166 = 0.271$. Marca C: $30/166 = 0.181$.
2. Marcas D y E: $14/166 = 0.084$ ambas, aunque el precio medio de reventa es 320 mil pesos en D y 240 mil en E.
3. Marcas G y H: $2/166 = 0.012$ ambas.
4. De ocho marcas quedan solo seis códigos distintos: el modelo no puede separar D de E ni G de H.

:::figura[El catálogo contado completo: las marcas D y E, y también G y H, terminan con el mismo código.]{componente="FeatureEngineeringViz"}
```yaml
modo: frecuencia
caso: marcas
```
:::

## Propiedades

- **No usa la variable objetivo.** No hay riesgo de que la respuesta de una fila entre en su propia variable, a diferencia de la codificación por objetivo.
- **Es monótona en la popularidad.** Los modelos aprenden efectos del tipo "las categorías raras se comportan distinto".
- **Asigna el mismo código a categorías con la misma frecuencia.** La pérdida de información es mayor cuanto más categorías comparten conteo.

:::figura[Colonias de una ciudad codificadas por frecuencia: las que tienen el mismo número de casas, como las tres colonias de una sola casa, reciben el mismo código y el modelo ya no puede distinguirlas.]{componente="FeatureEngineeringViz"}
```yaml
modo: frecuencia
caso: colonias
```
:::

## Errores comunes

- **Calcular las frecuencias con todos los datos.** Aunque no use el objetivo, la proporción debe fijarse con el entrenamiento para que el código de una categoría no cambie según la partición.
- **Suponer que la frecuencia describe a la categoría.** Dos marcas igual de comunes pueden ser opuestas en todo lo demás; el código solo dice qué tan común es cada una.
- **Olvidar las categorías nuevas.** En producción aparecen categorías que no estaban en el entrenamiento; se les asigna un código definido de antemano.

:::figura[Error de suponer que la frecuencia describe a la categoría: las marcas D y E tienen 14 anuncios cada una y reciben el mismo código, aunque los precios de reventa típicos de una y otra difieren en unos 80 mil pesos.]{componente="FeatureEngineeringViz"}
```yaml
modo: frecuencia
caso: marcas
semilla: 3
```
:::

## Conexiones

Cada código es una frecuencia relativa, como las que se representan en un [[grafico-de-barras]], y una estimación de la probabilidad de la categoría en la [[distribucion-categorica]]. Es una alternativa de una sola columna a la [[codificacion-one-hot]], complementaria de la [[codificacion-por-objetivo]], que sí usa la respuesta, y del [[truco-de-hashing]], que tampoco usa la respuesta pero conserva la identidad de muchas categorías.

## Formulario

:::formula[Código por frecuencia]
$$
\tilde{x}_c = \frac{n_c}{n}
$$

- $n_c$: filas de la categoría $c$.
- $n$: total de filas de entrenamiento.
:::

:::formula[Suma de los códigos de todas las categorías]
$$
\sum_{c} \tilde{x}_c = 1
$$

- La suma recorre todas las categorías observadas en entrenamiento.
:::
