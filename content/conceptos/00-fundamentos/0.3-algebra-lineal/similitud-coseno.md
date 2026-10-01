---
id: similitud-coseno
titulo: Similitud coseno
titulo_en: Cosine similarity
alias:
  - coseno del ángulo
  - distancia coseno
modulo: 0
submodulo: '0.3'
orden: 10
nivel: basico
prerrequisitos:
  - normas-vectoriales
relaciones:
  - tipo: contrasta
    id: distancias
etiquetas:
  - similitud
  - ángulo
  - texto
  - recomendación
resumen: >
  La similitud coseno compara dos vectores por su dirección, sin importar su tamaño: es el producto punto
  dividido entre el producto de las normas, y vale 1 si apuntan igual, 0 si son perpendiculares y -1 si son opuestos.
formula: '\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert_2 \, \lVert \mathbf{v} \rVert_2}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: producto-punto
    u: [5, 2]
    v: [2, 4]
referencias:
  - clave: murphy
  - clave: strang
publicado: true
---

## Intuición

Dos reseñas de un restaurante, una corta y otra larga, pueden decir lo mismo con distinta cantidad de palabras. Si cada reseña se resume contando cuántas veces aparece cada palabra, la larga produce un vector más grande, pero con la misma proporción de palabras apunta en la misma dirección. Para decir que las dos reseñas se parecen conviene ignorar el tamaño y comparar solo la dirección.

La similitud coseno hace eso: mide el coseno del ángulo entre los dos vectores. Si apuntan igual, el ángulo es cero y la similitud es 1, aunque uno sea diez veces más largo. Si son perpendiculares, no comparten nada y la similitud es 0. Si apuntan en sentidos opuestos, vale $-1$. Por eso se usa para comparar textos, perfiles de usuarios y representaciones aprendidas por redes neuronales, donde la magnitud suele reflejar la cantidad de datos y no su contenido.

## Definición

:::definicion[Similitud coseno]
Para vectores no nulos $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$,
$$
\operatorname{sim}(\mathbf{u}, \mathbf{v}) = \cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert_2\,\lVert \mathbf{v} \rVert_2} = \frac{\sum_i u_i v_i}{\sqrt{\sum_i u_i^2}\,\sqrt{\sum_i v_i^2}} \in [-1, 1].
$$
La **distancia coseno** es $1 - \operatorname{sim}(\mathbf{u}, \mathbf{v})$.
:::

La similitud no está definida si alguno de los vectores es el vector cero. Con vectores de entradas no negativas, como conteos de palabras, la similitud está entre 0 y 1.

:::nota[Qué significa cada símbolo]
- $\mathbf{u}, \mathbf{v}$: vectores que se comparan, no nulos.
- $\theta$: ángulo entre ellos.
- $\mathbf{u} \cdot \mathbf{v}$: producto punto.
- $\lVert \cdot \rVert_2$: norma euclidiana.
- $u_i, v_i$: componentes de cada vector.
- $\operatorname{sim}$: similitud coseno.
:::

## Cómo usar la visualización

Las puntas de $\mathbf{u}$ y $\mathbf{v}$ se arrastran; el panel muestra el producto punto, el ángulo y la similitud coseno. La reproducción hace girar $\mathbf{v}$ alrededor del origen, y la similitud recorre todos los valores entre $-1$ y 1.

Al alargar $\mathbf{v}$ sin cambiar su dirección, el producto punto crece pero la similitud coseno no cambia. En el momento en que $\mathbf{v}$ queda perpendicular a $\mathbf{u}$ la similitud es 0, y cuando apunta al lado contrario es $-1$.

## Ejemplo

Tres noticias se resumen por el número de veces que aparecen las palabras "gol" y "elección": $\mathbf{d}_1 = (3, 1)$, $\mathbf{d}_2 = (6, 2)$ y $\mathbf{d}_3 = (1, 3)$.

1. $\operatorname{sim}(\mathbf{d}_1, \mathbf{d}_2) = \frac{18 + 2}{\sqrt{10}\,\sqrt{40}} = \frac{20}{20} = 1$: misma proporción de palabras, mismo tema, aunque $\mathbf{d}_2$ sea el doble de larga.
2. $\operatorname{sim}(\mathbf{d}_1, \mathbf{d}_3) = \frac{3 + 3}{\sqrt{10}\,\sqrt{10}} = 0.6$: temas parecidos solo en parte.
3. La distancia euclidiana entre $\mathbf{d}_1$ y $\mathbf{d}_2$ es $\sqrt{9 + 1} \approx 3.16$, mayor que entre $\mathbf{d}_1$ y $\mathbf{d}_3$, $\sqrt{4 + 4} \approx 2.83$. La distancia sugiere lo contrario de lo que dice el contenido.
4. El ángulo entre $\mathbf{d}_1$ y $\mathbf{d}_3$ es $\arccos 0.6 \approx 53.1$ grados.

:::figura[Las noticias d₁ = (3, 1) y d₃ = (1, 3) del ejemplo: forman un ángulo de 53 grados y su similitud coseno es 0.6.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [3, 1]
v: [1, 3]
```
:::

:::figura[Las noticias d₁ = (3, 1) y d₂ = (6, 2): la segunda es el doble de larga pero apunta en la misma dirección, así que su similitud coseno es 1.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [3, 1]
v: [6, 2]
```
:::

## Propiedades

- **Rango:** $-1 \le \operatorname{sim}(\mathbf{u}, \mathbf{v}) \le 1$, por la desigualdad de Cauchy-Schwarz.
- **Invariancia por escala positiva:** $\operatorname{sim}(a\mathbf{u}, b\mathbf{v}) = \operatorname{sim}(\mathbf{u}, \mathbf{v})$ si $a, b > 0$; con un factor negativo cambia de signo.
- **Vectores unitarios:** si $\lVert \mathbf{u} \rVert = \lVert \mathbf{v} \rVert = 1$, la similitud es el producto punto.
- **Relación con la distancia euclidiana:** para vectores unitarios, $\lVert \mathbf{u} - \mathbf{v} \rVert_2^2 = 2 - 2\operatorname{sim}(\mathbf{u}, \mathbf{v})$.
- **Relación con la correlación:** la correlación de Pearson entre dos variables es la similitud coseno de sus vectores centrados en su media.

:::figura[Caso de vectores opuestos: (4, 1) y (-4, -1) apuntan en sentidos contrarios y su similitud coseno es -1.]{componente="VectorPlane"}
```yaml
modo: producto-punto
u: [4, 1]
v: [-4, -1]
```
:::

:::demostracion
Relación con la distancia: si $\lVert \mathbf{u} \rVert = \lVert \mathbf{v} \rVert = 1$, entonces $\lVert \mathbf{u} - \mathbf{v} \rVert^2 = \mathbf{u} \cdot \mathbf{u} - 2\,\mathbf{u} \cdot \mathbf{v} + \mathbf{v} \cdot \mathbf{v} = 2 - 2\,\mathbf{u} \cdot \mathbf{v}$, y $\mathbf{u} \cdot \mathbf{v}$ es la similitud.
:::

## Errores comunes

- **Llamar métrica a la distancia coseno.** $1 - \cos\theta$ no cumple la desigualdad del triángulo en general.
- **Usarla cuando el tamaño importa.** Si la magnitud tiene significado, como un monto de compra, ignorarla pierde información.
- **Aplicarla al vector cero.** Una noticia sin ninguna de las palabras contadas no tiene dirección y la similitud no está definida.
- **Interpretar 0 como "opuestos".** Similitud 0 significa que los vectores son perpendiculares; opuestos es $-1$.

## Conexiones

La similitud coseno es el [[producto-punto]] de dos vectores divididos entre sus [[normas-vectoriales|normas]], y se contrasta con las [[distancias]], que sí dependen del tamaño. Similitud cero equivale a [[ortogonalidad-y-ortonormalidad|ortogonalidad]]. En estadística, la correlación es la similitud coseno de datos centrados, y en recuperación de información se usa para ordenar documentos por parecido a una consulta.

## Formulario

:::formula[Similitud coseno]
$$
\operatorname{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert_2\,\lVert \mathbf{v} \rVert_2}
$$

- $\mathbf{u} \cdot \mathbf{v}$: producto punto.
- $\lVert \cdot \rVert_2$: norma euclidiana.
:::

:::formula[Distancia coseno]
$$
d_{\cos}(\mathbf{u}, \mathbf{v}) = 1 - \operatorname{sim}(\mathbf{u}, \mathbf{v})
$$

- $d_{\cos}$: disimilitud entre 0 y 2.
:::

:::formula[Vectores unitarios]
$$
\lVert \mathbf{u} - \mathbf{v} \rVert_2^2 = 2 - 2\operatorname{sim}(\mathbf{u}, \mathbf{v}), \qquad \lVert \mathbf{u} \rVert = \lVert \mathbf{v} \rVert = 1
$$

- $\mathbf{u}, \mathbf{v}$: vectores de longitud 1.
:::
