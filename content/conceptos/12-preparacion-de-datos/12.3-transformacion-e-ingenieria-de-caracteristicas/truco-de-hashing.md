---
id: truco-de-hashing
titulo: Truco de hashing
titulo_en: Hashing trick
alias:
  - feature hashing
  - hashing de características
  - codificación por hash
modulo: 12
submodulo: '12.3'
orden: 11
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - principio-del-palomar
etiquetas:
  - variables categóricas
  - codificación
  - función hash
  - alta cardinalidad
resumen: >
  El truco de hashing asigna cada categoría a una de k columnas mediante una función hash, sin guardar un
  diccionario. Acota el número de columnas a cambio de colisiones entre categorías que comparten columna.
formula: 'j(c) = h(c) \bmod k'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: hashing
    caso: municipios
    cubetas: 16
referencias:
  - clave: murphy
  - clave: hastie-esl
publicado: true
---

## Intuición

Un sistema de anuncios recibe el municipio de cada visitante. Hay más de 2400 municipios en el país, aparecen municipios nuevos en los datos cada semana y el modelo debe actualizarse sin reconstruir su lista de columnas. Mantener un diccionario "municipio a columna" para la codificación one-hot es costoso y frágil.

El **truco de hashing** evita el diccionario. Una función hash convierte cualquier texto en un número entero de apariencia aleatoria pero siempre igual para el mismo texto; el residuo de dividir ese número entre $k$ indica la columna. Así, "Zapopan" siempre cae en la misma columna, un municipio nunca visto también recibe una columna sin consultar nada, y el modelo tiene exactamente $k$ columnas pase lo que pase. El precio es inevitable: con más categorías que columnas, algunas comparten columna y el modelo no puede distinguirlas. Si $k$ es suficientemente grande, las colisiones son raras y afectan sobre todo a categorías poco frecuentes. Una variante asigna además un signo $+1$ o $-1$ a cada categoría, para que las colisiones tiendan a cancelarse en lugar de sumarse.

## Definición

:::definicion[Truco de hashing]
Sea $h$ una función hash que asigna a cada texto un entero no negativo. Con $k$ columnas, la categoría $c$ se representa con el vector $\mathbf{x} \in \mathbb{R}^k$ cuya única componente distinta de cero es

$$
x_{j(c)} = s(c), \qquad j(c) = h(c) \bmod k,
$$

donde $s(c) = 1$ en la versión simple y $s(c) \in \{-1, +1\}$, dado por una segunda función hash, en la versión con signo. Si $n$ categorías se reparten al azar en $k$ columnas, el número esperado de pares en colisión es

$$
\mathbb{E}[\text{colisiones}] = \binom{n}{2}\frac{1}{k}.
$$
:::

:::nota[Qué significa cada símbolo]
- $c$: categoría, como texto.
- $h(c)$: valor de la función hash, un entero grande.
- $k$: número de columnas (cubetas).
- $\bmod$: residuo de la división entera.
- $j(c)$: columna asignada a la categoría, entre $0$ y $k - 1$.
- $s(c)$: signo de la categoría.
- $\mathbf{x}$: vector de $k$ componentes que representa a la categoría.
- $n$: número de categorías distintas.
- $\binom{n}{2}$: número de pares de categorías.
:::

## Cómo usar la visualización

Cada recuadro es una columna y lleva su número. Al reproducir, cada municipio se asigna a su columna según su hash; el encabezado muestra el hash y el residuo. Los recuadros con más de un municipio se resaltan: son colisiones. Las lecturas comparan los pares en colisión con los esperados si el reparto fuera al azar. El interruptor agrega el signo de cada categoría.

Experimentos sugeridos: con 8 columnas y 24 municipios casi todas las columnas tienen colisiones; con 64 quedan pocas. Comparar en cada caso los pares observados con los esperados.

## Ejemplo

Con la función hash FNV-1a de 32 bits y $k = 8$:

1. $h(\text{Zapopan}) = 1992350784$ y $1992350784 \bmod 8 = 0$: columna 0.
2. $h(\text{Tlaquepaque}) = 3763363519$, residuo 7: columna 7.
3. $h(\text{León}) = 2949967055$, residuo 7: columna 7. Tlaquepaque y León chocan.
4. $h(\text{Mérida}) = 2046305853$, residuo 5: columna 5.
5. Con 24 municipios y 8 columnas, el número esperado de pares en colisión es $\binom{24}{2}/8 = 276/8 = 34.5$. Con 64 columnas baja a $276/64 = 4.3$.

:::figura[Los 24 municipios en 8 columnas: casi todas las columnas reúnen a varios municipios y los pares en colisión rondan los 34.5 esperados.]{componente="FeatureEngineeringViz"}
```yaml
modo: hashing
caso: municipios
cubetas: 8
```
:::

## Propiedades

- **Número fijo de columnas.** La dimensión no crece con el número de categorías.
- **No requiere diccionario.** Las categorías nuevas se codifican igual que las conocidas, sin actualizar nada.
- **Las colisiones disminuyen como $1/k$.** Duplicar las columnas reduce a la mitad los pares en colisión esperados.

:::figura[Con 64 columnas, la mayoría de los municipios queda sola en su columna y solo unos cuantos pares chocan.]{componente="FeatureEngineeringViz"}
```yaml
modo: hashing
caso: municipios
cubetas: 64
```
:::

- **Con signo, las colisiones son insesgadas en promedio.** Si dos categorías comparten columna con signos opuestos, su suma no infla la columna; el producto punto entre vectores se conserva en valor esperado.

:::figura[Navegadores con hashing con signo en 8 columnas: en dos de las columnas con colisión hay categorías con signos opuestos, de modo que sus contribuciones se cancelan en parte en lugar de sumarse todas.]{componente="FeatureEngineeringViz"}
```yaml
modo: hashing
caso: navegadores
cubetas: 8
signo: true
```
:::

## Errores comunes

- **Elegir k demasiado pequeño.** Por el principio del palomar, con más categorías que columnas hay colisiones seguras; con muchas colisiones, categorías frecuentes y con efectos opuestos se confunden.
- **Cambiar la función hash o k después de entrenar.** El modelo aprendió coeficientes por columna; con otra función o otro $k$, cada categoría cae en una columna distinta y las predicciones pierden sentido.
- **Esperar interpretar las columnas.** Una columna no corresponde a una categoría sino a todas las que caen en ella; los coeficientes no se leen como efectos de una categoría.

:::figura[Error de elegir k demasiado pequeño: con 4 columnas, cada una recibe varios municipios y el modelo ya no puede separar sus efectos.]{componente="FeatureEngineeringViz"}
```yaml
modo: hashing
caso: municipios
cubetas: 4
```
:::

## Conexiones

Es una variante de la [[codificacion-one-hot]] con un número fijo de columnas. Que haya colisiones cuando las categorías superan a las columnas es el [[principio-del-palomar]], y el número esperado de pares en colisión se calcula con el [[coeficiente-binomial]], como en la [[paradoja-del-cumpleanos]]. Se aplica también a las palabras de la [[bolsa-de-palabras]] cuando el vocabulario es enorme. Otras opciones para muchas categorías son la [[codificacion-por-frecuencia]], la [[codificacion-por-objetivo]] y los [[embeddings-de-variables-categoricas]].

## Formulario

:::formula[Columna asignada]
$$
j(c) = h(c) \bmod k
$$

- $j(c)$: columna asignada a la categoría $c$, entre $0$ y $k - 1$.
- $h(c)$: hash de la categoría, un entero.
- $\bmod$: residuo de la división entera.
- $k$: número de columnas.
:::

:::formula[Colisiones esperadas]
$$
\mathbb{E}[\text{colisiones}] = \binom{n}{2}\frac{1}{k} = \frac{n(n - 1)}{2k}
$$

- $n$: número de categorías distintas.
- $k$: número de columnas.
:::

:::formula[Vector con signo]
$$
x_{j(c)} = s(c) \in \{-1, +1\}
$$

- $x_{j(c)}$: valor que la categoría $c$ escribe en su columna $j(c)$.
- $s(c)$: signo dado por una segunda función hash.
:::
