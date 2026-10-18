---
id: tf-idf
titulo: TF-IDF
titulo_en: TF-IDF (term frequency, inverse document frequency)
alias:
  - frecuencia de término por frecuencia inversa de documento
  - ponderación tf-idf
  - term frequency inverse document frequency
modulo: 12
submodulo: '12.3'
orden: 19
nivel: basico
prerrequisitos:
  - bolsa-de-palabras
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - texto
  - ponderación
  - ingeniería de características
  - recuperación de información
resumen: >
  TF-IDF pondera cada palabra de un documento por su frecuencia en ese documento y por lo rara que es en el
  conjunto de documentos, de modo que las palabras presentes en todos los textos pesan poco o nada.
formula: 'w_{dt} = \mathrm{tf}_{dt} \cdot \log\frac{N}{\mathrm{df}_t}'
visualizacion:
  componente: TextFeaturesViz
  parametros:
    modo: tfidf
    corpus: resenas
referencias:
  - clave: murphy
  - clave: cover-thomas
publicado: true
---

## Intuición

En las reseñas de un restaurante, casi todas mencionan "comida" y "servicio". Esas palabras aparecen tanto que no ayudan a distinguir una reseña de otra: decir que dos reseñas se parecen porque ambas hablan de la comida no informa nada. En cambio, "excelente" o "fría" aparecen en pocas reseñas y dicen mucho de cada una.

**TF-IDF** formaliza esa intuición con dos factores. La **frecuencia del término** (tf) mide cuánto usa un documento una palabra, relativa a su longitud. La **frecuencia inversa en documentos** (idf) mide qué tan rara es la palabra en el conjunto: es grande para palabras que aparecen en pocos documentos y cero para las que aparecen en todos. El peso de cada palabra en cada documento es el producto de ambos. Una palabra que una reseña repite y que casi nadie más usa recibe un peso alto; una palabra común a todas recibe peso cero, aunque se repita. Al comparar documentos con estos pesos, las coincidencias en palabras comunes dejan de contar.

## Definición

:::definicion[TF-IDF]
Sean $N$ documentos y $x_{dt}$ el número de veces que el término $t$ aparece en el documento $d$. Se definen

$$
\mathrm{tf}_{dt} = \frac{x_{dt}}{\sum_{t'} x_{dt'}}, \qquad \mathrm{idf}_t = \log\frac{N}{\mathrm{df}_t}, \qquad w_{dt} = \mathrm{tf}_{dt} \cdot \mathrm{idf}_t,
$$

donde $\mathrm{df}_t$ es el número de documentos que contienen a $t$. Hay variantes: conteos sin dividir, idf suavizado $\log\frac{1 + N}{1 + \mathrm{df}_t} + 1$, o filas normalizadas en L2 al final.
:::

:::nota[Qué significa cada símbolo]
- $N$: número de documentos.
- $x_{dt}$: conteo del término $t$ en el documento $d$.
- $\sum_{t'} x_{dt'}$: longitud del documento $d$, en palabras.
- $\mathrm{tf}_{dt}$: frecuencia relativa del término en el documento.
- $\mathrm{df}_t$: número de documentos que contienen el término $t$.
- $\mathrm{idf}_t$: frecuencia inversa en documentos; vale $0$ si $\mathrm{df}_t = N$.
- $\log$: logaritmo natural.
- $w_{dt}$: peso tf-idf del término $t$ en el documento $d$.
:::

## Cómo usar la visualización

La tabla avanza en cuatro etapas: conteos, frecuencias relativas, la fila de idf debajo de la tabla y, al final, los pesos tf-idf. Las celdas más oscuras tienen valores mayores; al llegar a los pesos, las columnas de palabras presentes en todas las reseñas quedan en cero. El encabezado muestra la fórmula de la etapa con el idf de la palabra más rara. Las lecturas comparan la similitud de las dos primeras reseñas con conteos y con tf-idf.

Experimento sugerido: cambiar al corpus de titulares de noticias y observar qué palabras reciben idf cero y cuáles el idf más alto.

## Ejemplo

Las cuatro reseñas del restaurante tienen 13 términos distintos.

1. "comida" y "servicio" aparecen en las 4 reseñas: $\mathrm{idf} = \log(4/4) = 0$.
2. "la", "rica", "y", "el" y "lento" aparecen en 2: $\mathrm{idf} = \log(4/2) = 0.693$.
3. "excelente" aparece solo en la reseña 4: $\mathrm{idf} = \log(4/1) = 1.386$.
4. La reseña 4, "Excelente comida, excelente servicio", tiene 4 palabras: $\mathrm{tf}_{\text{excelente}} = 2/4 = 0.5$ y $w = 0.5 \times 1.386 = 0.693$. Para "comida", $w = 0.25 \times 0 = 0$.
5. La similitud coseno entre las reseñas 1 y 2 baja de 0.625 con conteos a 0.250 con tf-idf, porque ya no cuentan "comida" ni "servicio".

:::figura[Titulares de noticias: el artículo "el", presente en todos los titulares, recibe peso cero, y las palabras que aparecen en un solo titular, como tasa o gasolina, reciben los pesos más altos.]{componente="TextFeaturesViz"}
```yaml
modo: tfidf
corpus: noticias
```
:::

## Propiedades

- **Las palabras presentes en todos los documentos tienen peso cero.** Funciona como una eliminación automática de palabras vacías y de términos genéricos del dominio.
- **El idf crece con la rareza, pero solo de forma logarítmica.** Una palabra en 1 de 1000 documentos pesa $\log 1000 = 6.9$, no mil veces más que una común.
- **No usa la variable objetivo.** Es una transformación no supervisada que solo depende de los textos de entrenamiento.

:::figura[Las opiniones con negaciones: "no" aparece en dos de los cuatro textos y recibe idf positivo, pero la representación sigue sin saber qué palabra niega.]{componente="TextFeaturesViz"}
```yaml
modo: tfidf
corpus: negacion
```
:::

## Errores comunes

- **Calcular el idf con los documentos de prueba.** El número de documentos y las frecuencias se calculan con el entrenamiento y se reutilizan.
- **Suponer que peso cero significa irrelevancia.** Una palabra presente en todos los documentos no distingue unos de otros, pero puede importar para otra tarea; en colecciones pequeñas, el idf es muy inestable.
- **Comparar documentos de longitudes muy distintas sin normalizar.** Aun con tf relativo, conviene normalizar las filas en L2 antes de medir similitudes.

:::figura[Error de tomar el peso cero como irrelevancia: en estos avisos del clima, la palabra lluvia aparece en los cuatro documentos, su idf vale 0 y su peso desaparece, aunque es justamente el tema de la colección.]{componente="TextFeaturesViz"}
```yaml
modo: tfidf
corpus: clima
```
:::

## Conexiones

Se construye sobre la [[bolsa-de-palabras]] y se combina con la [[normalizacion-por-norma]] para comparar documentos con la [[similitud-coseno]]. El idf usa el [[funcion-exponencial-y-logaritmo-natural|logaritmo natural]], y su interpretación como medida de rareza se relaciona con la información de un evento en teoría de la información. Los [[n-gramas]] se ponderan con tf-idf de la misma manera.

## Formulario

:::formula[Frecuencia de término]
$$
\mathrm{tf}_{dt} = \frac{x_{dt}}{\sum_{t'} x_{dt'}}
$$

- $x_{dt}$: conteo del término $t$ en el documento $d$.
- $\sum_{t'} x_{dt'}$: número de palabras del documento.
:::

:::formula[Frecuencia inversa en documentos]
$$
\mathrm{idf}_t = \log\frac{N}{\mathrm{df}_t}
$$

- $N$: número de documentos; $\mathrm{df}_t$: documentos que contienen $t$.
:::

:::formula[Peso tf-idf]
$$
w_{dt} = \mathrm{tf}_{dt} \cdot \mathrm{idf}_t
$$

- $w_{dt}$: peso del término $t$ en el documento $d$.
:::
