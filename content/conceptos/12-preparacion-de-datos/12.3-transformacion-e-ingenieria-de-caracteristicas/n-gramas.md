---
id: n-gramas
titulo: N-gramas
titulo_en: N-grams
alias:
  - bigramas
  - trigramas
  - secuencias de n palabras
modulo: 12
submodulo: '12.3'
orden: 20
nivel: basico
prerrequisitos:
  - bolsa-de-palabras
  - variaciones
etiquetas:
  - texto
  - ingeniería de características
  - orden de las palabras
  - vocabulario
resumen: >
  Un n-grama es una secuencia de n palabras consecutivas. Contar bigramas o trigramas además de palabras
  sueltas recupera parte del orden que la bolsa de palabras pierde, a cambio de un vocabulario mucho mayor.
formula: '\text{n-gramas}(w_1, \dots, w_L) = \{(w_i, \dots, w_{i+n-1}) : i = 1, \dots, L - n + 1\}'
visualizacion:
  componente: TextFeaturesViz
  parametros:
    modo: ngramas
    corpus: negacion
    n: 2
referencias:
  - clave: murphy
  - clave: goodfellow
publicado: true
---

## Intuición

"El servicio es bueno" y "el servicio no es bueno" dicen lo contrario, pero en una bolsa de palabras se diferencian por una sola palabra: "no". Sus vectores de conteos son casi iguales y su similitud coseno es 0.89. El problema es que la bolsa olvida el orden, y en el lenguaje el orden importa: "no" cambia el sentido de la palabra que lo sigue.

Un **n-grama** es una secuencia de $n$ palabras seguidas. Con $n = 2$ (bigramas), "el servicio no es bueno" se descompone en "el servicio", "servicio no", "no es" y "es bueno". Ahora la negación aparece unida a su contexto, y "no es" funciona como una pista que la bolsa de palabras sueltas no tenía. Con $n = 3$ (trigramas), cada pieza captura todavía más contexto. El precio es que el número de n-gramas distintos crece muy rápido: casi cualquier par de palabras puede aparecer junto alguna vez, así que el vocabulario se multiplica y la mayoría de los n-gramas aparece una sola vez.

## Definición

:::definicion[N-grama]
Sea un documento con la secuencia de palabras $w_1, \dots, w_L$. Sus **n-gramas** son las secuencias de $n$ palabras consecutivas

$$
g_i = (w_i, w_{i+1}, \dots, w_{i+n-1}), \qquad i = 1, \dots, L - n + 1.
$$

La representación por n-gramas cuenta cuántas veces aparece cada n-grama del vocabulario, igual que la bolsa de palabras; los unigramas ($n = 1$) son la bolsa de palabras original. Es común combinar varios tamaños, por ejemplo unigramas y bigramas juntos.
:::

:::nota[Qué significa cada símbolo]
- $w_1, \dots, w_L$: palabras del documento, en orden.
- $L$: número de palabras del documento.
- $n$: longitud de los n-gramas.
- $g_i$: n-grama que empieza en la posición $i$.
- $L - n + 1$: número de n-gramas del documento.
:::

## Cómo usar la visualización

Una ventana de $n$ palabras, resaltada en naranja, recorre cada opinión. En cada posición se forma un n-grama y su columna de la tabla suma uno. Las lecturas muestran cuántos n-gramas distintos hay y comparan la similitud coseno de las dos primeras opiniones con palabras sueltas y con n-gramas del tamaño elegido.

Experimentos sugeridos: con $n = 1$, las dos primeras opiniones son casi iguales; con $n = 2$ la similitud baja y con $n = 3$ ya no comparten ningún n-grama. Cambiar al corpus de reseñas para ver cómo crece el vocabulario.

## Ejemplo

Las opiniones son "el servicio es bueno" ($L = 4$) y "el servicio no es bueno" ($L = 5$).

1. Unigramas: comparten 4 de 4 palabras; la segunda tiene además "no". Similitud coseno $4/(\sqrt{4}\sqrt{5}) = 0.894$.
2. Bigramas de la primera ($L - 1 = 3$): "el servicio", "servicio es", "es bueno".
3. Bigramas de la segunda (4): "el servicio", "servicio no", "no es", "es bueno".
4. Comparten 2 bigramas: similitud $2/(\sqrt{3}\sqrt{4}) = 0.577$.
5. Trigramas: "el servicio es", "servicio es bueno" frente a "el servicio no", "servicio no es", "no es bueno". No comparten ninguno: similitud 0.

:::figura[Trigramas de las mismas opiniones: ningún par de opiniones comparte un trigrama y la similitud de las dos primeras es cero.]{componente="TextFeaturesViz"}
```yaml
modo: ngramas
corpus: negacion
n: 3
```
:::

## Propiedades

- **Un documento de $L$ palabras tiene $L - n + 1$ n-gramas.** Para $n$ grande, los documentos cortos producen pocos o ninguno.
- **El vocabulario crece rápidamente con $n$.** Con un vocabulario de $|V|$ palabras hay hasta $|V|^n$ n-gramas posibles; en la práctica solo aparecen algunos, pero la mayoría con frecuencia 1.

:::figura[Bigramas de las reseñas del restaurante: el vocabulario de bigramas es mayor que el de palabras y casi todos aparecen una sola vez.]{componente="TextFeaturesViz"}
```yaml
modo: ngramas
corpus: resenas
n: 2
```
:::

- **Capturan orden local, no global.** Los bigramas distinguen "no es bueno" de "es bueno", pero no relacionan palabras separadas por más de $n - 1$ posiciones.

## Errores comunes

- **Usar n grande con pocos datos.** Con trigramas o más, la mayoría de las columnas aparece en un solo documento y el modelo memoriza en lugar de generalizar.
- **Quitar las palabras vacías antes de formar n-gramas.** Al quitar "no", la negación desaparece de los bigramas; las palabras vacías se filtran después o no se filtran.
- **Esperar que capturen dependencias largas.** En "no creo que el servicio sea bueno", la negación está a cinco palabras de "bueno"; ningún bigrama las conecta.

:::figura[Error de usar n grande con pocos datos: trigramas de las reseñas, casi todos distintos entre sí y presentes en una sola reseña.]{componente="TextFeaturesViz"}
```yaml
modo: ngramas
corpus: resenas
n: 3
```
:::

## Conexiones

Con $n = 1$ los n-gramas son la [[bolsa-de-palabras]], y sus conteos se ponderan igual con [[tf-idf]]. El número de secuencias posibles de $n$ palabras con repetición es una [[permutaciones-con-repeticion|variación con repetición]], lo que explica el crecimiento del vocabulario. Cuando el vocabulario es enorme se usa el [[truco-de-hashing]]. Las combinaciones de palabras son a los textos lo que las [[caracteristicas-de-interaccion]] son a las variables numéricas.

## Formulario

:::formula[N-gramas de un documento]
$$
g_i = (w_i, \dots, w_{i+n-1}), \qquad i = 1, \dots, L - n + 1
$$

- $w_i$: palabra en la posición $i$; $L$: longitud del documento; $n$: tamaño del n-grama.
:::

:::formula[Número de n-gramas posibles]
$$
|V|^{n}
$$

- $|V|$: tamaño del vocabulario de palabras; $n$: longitud del n-grama.
:::
