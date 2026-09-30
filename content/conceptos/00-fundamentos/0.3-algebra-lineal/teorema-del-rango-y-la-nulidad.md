---
id: teorema-del-rango-y-la-nulidad
titulo: Teorema del rango y la nulidad
titulo_en: Rank-nullity theorem
alias:
  - teorema de la dimensión
  - rango más nulidad
  - nulidad
modulo: 0
submodulo: '0.3'
orden: 21
nivel: basico
prerrequisitos:
  - espacio-columna-espacio-fila-y-espacio-nulo
etiquetas:
  - rango
  - nulidad
  - variables libres
  - dimensión
resumen: >
  Para una matriz de m por n, el rango más la nulidad es n: cada columna aporta una dirección nueva a la
  imagen o una dirección al espacio nulo, y el número de variables libres es la nulidad.
formula: '\operatorname{rango}(A) + \dim N(A) = n'
visualizacion:
  componente: MatrixSteps
  parametros:
    modo: rango
    reducida: true
    matrices:
      - nombre: 3 por 5, rango 2
        matriz: [[1, 2, 0, -1, 3], [0, 0, 1, 2, -1], [1, 2, 1, 1, 2]]
      - nombre: 2 por 4, rango 2
        matriz: [[1, 0, 2, 1], [0, 1, -1, 3]]
      - nombre: 4 por 3, rango 3
        matriz: [[1, 0, 1], [0, 1, 1], [1, 1, 0], [2, 1, 1]]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Una matriz de $m \times n$ recibe vectores con $n$ componentes, es decir, $n$ grados de libertad. Esos grados de libertad se reparten en dos grupos. Algunos sobreviven: producen salidas distintas y forman la imagen, cuya dimensión es el rango. Los demás se pierden: son direcciones que la matriz manda a cero, y forman el espacio nulo, cuya dimensión es la nulidad. No hay una tercera opción, así que las dos cantidades suman $n$.

Al escalonar una matriz esto se ve directamente. Cada columna con pivote corresponde a una variable que queda determinada, y cada columna sin pivote corresponde a una variable libre que se puede elegir a voluntad; cada variable libre genera una dirección del espacio nulo. Es como un presupuesto: con $n$ columnas, lo que no se usa para producir se va a lo que se cancela.

## Definición

:::teorema[Rango y nulidad]
Para toda matriz $A \in \mathbb{R}^{m \times n}$,
$$
\operatorname{rango}(A) + \operatorname{nulidad}(A) = n, \qquad \operatorname{nulidad}(A) = \dim N(A).
$$
En la forma escalonada de $A$, el rango es el número de columnas pivote y la nulidad es el número de columnas libres.
:::

Para una transformación lineal $T : V \to W$ con $V$ de dimensión finita, el enunciado es $\dim \operatorname{Im}(T) + \dim \ker(T) = \dim V$.

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m$ filas y $n$ columnas.
- $n$: número de columnas, o número de incógnitas del sistema $A\mathbf{x} = \mathbf{0}$.
- $\operatorname{rango}(A)$: dimensión del espacio columna.
- $\operatorname{nulidad}(A)$: dimensión del espacio nulo $N(A)$.
- $T$: transformación lineal de $V$ en $W$.
- $\operatorname{Im}(T)$: imagen de $T$; $\ker(T)$: núcleo de $T$.
:::

## Cómo usar la visualización

El selector elige una matriz. Las operaciones de fila la llevan a su forma escalonada reducida; al final, los pivotes quedan con borde y el panel lista las columnas pivote y las columnas libres. El rango es el número de pivotes y la nulidad el número de columnas libres, y juntos suman el número de columnas.

En la matriz de $3 \times 5$ la tercera fila desaparece y quedan 2 pivotes y 3 columnas libres: $2 + 3 = 5$. En la de $4 \times 3$ hay pivote en cada columna, la nulidad es 0 y la única solución de $A\mathbf{x} = \mathbf{0}$ es la trivial.

## Ejemplo

Una red de tuberías con 4 tramos cumple conservación de flujo en tres nodos, lo que da $A\mathbf{x} = \mathbf{0}$ con
$$
A = \begin{pmatrix} 1 & 1 & 2 & 0 \\ 0 & 1 & 1 & 1 \\ 1 & 2 & 3 & 1 \end{pmatrix}.
$$

1. La tercera fila es la suma de las dos primeras: al escalonar desaparece.
2. Forma reducida: $R_1 \leftarrow R_1 - R_2$ da $(1, 0, 1, -1)$ y queda $R_2 = (0, 1, 1, 1)$. Pivotes en las columnas 1 y 2: rango 2.
3. Columnas libres: 3 y 4, así que la nulidad es $4 - 2 = 2$.
4. Con $x_3 = s$ y $x_4 = t$: $x_1 = -s + t$, $x_2 = -s - t$. Entonces $\mathbf{x} = s(-1, -1, 1, 0) + t(1, -1, 0, 1)$.
5. Los dos vectores forman una base de $N(A)$: hay dos formas independientes de circular agua sin violar la conservación.

:::figura[El escalonamiento de la red de tuberías. Quedan dos pivotes y dos columnas libres, y 2 + 2 = 4 columnas.]{componente="MatrixSteps"}
```yaml
modo: rango
reducida: true
matrices:
  - nombre: Red de tuberías
    matriz: [[1, 1, 2, 0], [0, 1, 1, 1], [1, 2, 3, 1]]
```
:::

## Propiedades

- **Más incógnitas que ecuaciones:** si $n > m$, entonces $\operatorname{rango} \le m < n$ y la nulidad es positiva: $A\mathbf{x} = \mathbf{0}$ tiene soluciones no triviales.
- **Inyectividad:** $\mathbf{x} \mapsto A\mathbf{x}$ es inyectiva si y solo si la nulidad es 0, es decir, si el rango es $n$.
- **Suprayectividad:** es suprayectiva si y solo si el rango es $m$.
- **Matrices cuadradas:** para $n \times n$, inyectiva, suprayectiva e invertible son equivalentes.
- **Versión para la transpuesta:** $\operatorname{rango}(A) + \dim N(A^\top) = m$.
- **Grados de libertad de un sistema:** si $A\mathbf{x} = \mathbf{b}$ tiene solución, el conjunto de soluciones tiene dimensión igual a la nulidad.

:::figura[Casos en el plano: con rango 2 la nulidad es 0 y nada se pierde; con rango 1 una recta entera va a dar al cero; con rango 0 todo el plano es espacio nulo.]{componente="MatrixTransform"}
```yaml
modo: subespacios
matrices:
  - nombre: Rango 1, nulidad 1
    matriz: [[1, -1], [-2, 2]]
  - nombre: Rango 2, nulidad 0
    matriz: [[1, 2], [3, 1]]
  - nombre: Rango 0, nulidad 2
    matriz: [[0, 0], [0, 0]]
```
:::

:::demostracion
En la forma escalonada reducida $R$ de $A$ hay $r$ columnas pivote y $n - r$ columnas libres. Las soluciones de $R\mathbf{x} = \mathbf{0}$ (que son las de $A\mathbf{x} = \mathbf{0}$) quedan determinadas al elegir libremente las $n - r$ variables libres, y los vectores obtenidos al poner una variable libre en 1 y las demás en 0 son independientes y generan $N(A)$. Así $\dim N(A) = n - r$.
:::

## Errores comunes

- **Sumar el número de filas en lugar del de columnas.** La suma es $n$, el número de columnas.
- **Confundir nulidad con número de filas nulas.** La nulidad cuenta columnas libres; las filas nulas son $m - r$.
- **Creer que un sistema con más ecuaciones que incógnitas no puede tener infinitas soluciones.** Si las ecuaciones son dependientes, la nulidad puede ser positiva.
- **Olvidar que el teorema no dice nada sobre $A\mathbf{x} = \mathbf{b}$ con $\mathbf{b}$ fuera de la imagen.** En ese caso no hay soluciones, aunque la nulidad sea grande.

## Conexiones

El teorema relaciona las dimensiones de los subespacios de [[espacio-columna-espacio-fila-y-espacio-nulo]] y usa el [[rango-de-una-matriz|rango]]. Explica cuándo los [[sistemas-de-ecuaciones-lineales]] tienen infinitas soluciones y cuántos parámetros libres aparecen al resolverlos con [[eliminacion-gaussiana]]. En estadística, la nulidad de la matriz de diseño cuenta las combinaciones de coeficientes que un modelo no puede identificar.

## Formulario

:::formula[Teorema del rango y la nulidad]
$$
\operatorname{rango}(A) + \operatorname{nulidad}(A) = n
$$

- $n$: número de columnas de $A$.
- $\operatorname{nulidad}(A) = \dim N(A)$.
:::

:::formula[Conteo con la forma escalonada]
$$
\operatorname{rango}(A) = \#\,\text{columnas pivote}, \qquad \operatorname{nulidad}(A) = \#\,\text{columnas libres}
$$

- $\#$: número de columnas de cada tipo.
:::

:::formula[Versión para transformaciones]
$$
\dim \operatorname{Im}(T) + \dim \ker(T) = \dim V
$$

- $T : V \to W$: transformación lineal.
- $\ker(T)$: vectores que $T$ manda a cero.
:::
