---
id: codificacion-one-hot
titulo: Codificación one-hot
titulo_en: One-hot encoding
alias:
  - variables indicadoras
  - variables dummy
  - codificación binaria por categoría
modulo: 12
submodulo: '12.3'
orden: 7
nivel: basico
prerrequisitos:
  - datos-cualitativos-y-cuantitativos
  - funcion-indicadora-y-funcion-escalon
etiquetas:
  - variables categóricas
  - codificación
  - variables indicadoras
  - ingeniería de características
resumen: >
  La codificación one-hot convierte una variable categórica con K categorías en K columnas de ceros y unos,
  con un 1 en la columna de la categoría de cada fila. Con intercepto se elimina una columna de referencia.
formula: 'x \mapsto \big(\mathbf{1}\{x = c_1\}, \dots, \mathbf{1}\{x = c_K\}\big)'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: onehot
    caso: ciudades
referencias:
  - clave: james-isl
  - clave: agresti
publicado: true
---

## Intuición

Un modelo de precios de envío necesita la ciudad de destino, pero los modelos trabajan con números. Asignar Mérida = 1, Puebla = 2 y León = 3 sería un error: el modelo creería que León está "más lejos" de Mérida que Puebla y que el efecto de Puebla es el promedio de los otros dos. Las ciudades no tienen orden ni distancias entre sí.

La **codificación one-hot** evita ese problema creando una columna por ciudad. Cada fila tiene un 1 en la columna de su ciudad y 0 en las demás. Así el modelo puede asignar a cada ciudad un efecto propio, sin suponer ninguna relación entre ellas. Hay una sutileza: como cada fila tiene exactamente un 1, las columnas siempre suman 1, que es lo mismo que la columna de unos del intercepto. Para evitar esa redundancia en modelos lineales se elimina una de las columnas; la ciudad eliminada se vuelve la **referencia** y los coeficientes de las demás se leen como diferencias respecto a ella.

## Definición

:::definicion[Codificación one-hot]
Sea $x$ una variable categórica con categorías $c_1, \dots, c_K$. Su **codificación one-hot** es el vector

$$
\mathbf{e}(x) = \big(\mathbf{1}\{x = c_1\},\ \mathbf{1}\{x = c_2\},\ \dots,\ \mathbf{1}\{x = c_K\}\big) \in \{0, 1\}^K,
$$

que tiene exactamente un $1$. En la versión **con referencia** se omite la primera componente y se usan $K - 1$ columnas; la categoría $c_1$ se representa con un vector de ceros.
:::

:::nota[Qué significa cada símbolo]
- $x$: valor categórico de una fila.
- $c_1, \dots, c_K$: categorías posibles; $K$ es su número.
- $\mathbf{1}\{x = c_k\}$: indicadora; vale $1$ si la fila es de la categoría $c_k$ y $0$ si no.
- $\mathbf{e}(x)$: vector de $K$ componentes binarias.
- $\{0, 1\}^K$: conjunto de vectores de $K$ componentes, cada una $0$ o $1$.
:::

## Cómo usar la visualización

La tabla tiene la columna original a la izquierda y una columna por categoría. Al reproducir, cada fila se codifica en su turno: aparece un 1 sombreado en la columna de su categoría y ceros en el resto. La última columna suma la fila. El interruptor elimina la primera categoría, que pasa a ser la referencia.

Experimento sugerido: con todas las columnas, comprobar que la suma de cada fila es siempre 1; al eliminar la primera categoría, las filas de esa categoría suman 0 y las demás 1.

## Ejemplo

Ocho envíos van a Mérida, Puebla, León, Mérida, Toluca, León, Puebla y Mérida: $K = 4$ categorías.

1. Columnas en orden de aparición: Mérida, Puebla, León, Toluca.
2. El primer envío (Mérida) queda $(1, 0, 0, 0)$; el segundo (Puebla), $(0, 1, 0, 0)$; el quinto (Toluca), $(0, 0, 0, 1)$.
3. La matriz tiene $8 \times 4 = 32$ celdas y 8 unos: el 75 % son ceros.
4. Con Mérida como referencia quedan 3 columnas; un envío a Mérida es $(0, 0, 0)$. En una regresión del costo, el coeficiente de Puebla es la diferencia de costo entre Puebla y Mérida.

:::figura[Las ciudades con Mérida como referencia: tres columnas y filas de Mérida con todos los valores en cero.]{componente="FeatureEngineeringViz"}
```yaml
modo: onehot
caso: ciudades
eliminarPrimera: true
```
:::

## Propiedades

- **No impone orden ni distancias.** Cualesquiera dos categorías distintas están a la misma distancia euclidiana, $\sqrt{2}$.
- **Las K columnas suman 1.** Junto con un intercepto son linealmente dependientes; por eso se elimina una en modelos lineales.
- **El número de columnas crece con las categorías.** Una variable con miles de categorías produce una matriz enorme y muy dispersa.

:::figura[Formas de pago: cuatro categorías generan cuatro columnas, y cada fila tiene un solo 1.]{componente="FeatureEngineeringViz"}
```yaml
modo: onehot
caso: pagos
```
:::

## Errores comunes

- **Dejar las K columnas junto con un intercepto en una regresión lineal.** La matriz de diseño no tiene rango completo y los coeficientes no están determinados (la llamada trampa de las variables dummy).
- **Codificar con categorías distintas en entrenamiento y en producción.** Si en producción aparece una ciudad nueva o el orden de las columnas cambia, el modelo recibe vectores sin sentido; el catálogo de categorías se fija en el entrenamiento.
- **Usar one-hot con muchísimas categorías raras.** Cada columna rara tiene pocos unos y su coeficiente se estima mal; conviene agrupar las categorías raras o usar otras codificaciones.

:::figura[Error de dejar todas las columnas: cada fila suma 1, igual que la columna del intercepto, y una de las columnas puede escribirse con las demás.]{componente="FeatureEngineeringViz"}
```yaml
modo: onehot
caso: pagos
eliminarPrimera: false
```
:::

## Conexiones

Se aplica a variables [[datos-cualitativos-y-cuantitativos|cualitativas]] de escala nominal, como se definen en [[escalas-nominal-ordinal-de-intervalo-y-de-razon]], y cada columna es una [[funcion-indicadora-y-funcion-escalon|función indicadora]]. La dependencia de las $K$ columnas con el intercepto es un caso de [[independencia-lineal|dependencia lineal]] que reduce el [[rango-de-una-matriz]]. Cuando hay demasiadas categorías se usan la [[codificacion-por-frecuencia]], la [[codificacion-por-objetivo]], el [[truco-de-hashing]] o los [[embeddings-de-variables-categoricas]].

## Formulario

:::formula[Vector one-hot]
$$
\mathbf{e}(x) = \big(\mathbf{1}\{x = c_1\}, \dots, \mathbf{1}\{x = c_K\}\big)
$$

- $c_1, \dots, c_K$: categorías.
- $\mathbf{1}\{\cdot\}$: indicadora.
:::

:::formula[Suma de las columnas]
$$
\sum_{k=1}^{K} \mathbf{1}\{x = c_k\} = 1
$$

- Vale para toda fila; por eso las $K$ columnas son redundantes con el intercepto.
:::

:::formula[Distancia entre dos categorías distintas]
$$
\lVert \mathbf{e}(c_j) - \mathbf{e}(c_k) \rVert_2 = \sqrt{2}, \qquad j \ne k
$$

- Todas las parejas de categorías quedan igual de separadas.
:::
