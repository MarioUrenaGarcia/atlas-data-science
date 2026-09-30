---
id: valores-y-vectores-propios
titulo: Valores y vectores propios
titulo_en: Eigenvalues and eigenvectors
alias:
  - autovalores
  - autovectores
  - eigenvalores
  - eigenvectores
  - valores característicos
modulo: 0
submodulo: '0.3'
orden: 28
nivel: basico
prerrequisitos:
  - espacio-columna-espacio-fila-y-espacio-nulo
  - determinante-como-factor-de-volumen
etiquetas:
  - valores propios
  - vectores propios
  - direcciones invariantes
  - dinámica
resumen: >
  Un vector propio de A es una dirección que A no gira, solo estira: Av = lambda v. El factor lambda es su
  valor propio, y juntos describen el comportamiento de A a largo plazo.
formula: 'A\mathbf{v} = \lambda\mathbf{v}, \quad \mathbf{v} \neq \mathbf{0} \qquad\Longleftrightarrow\qquad (A - \lambda I)\mathbf{v} = \mathbf{0}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: propios
    matrices:
      - nombre: Simétrica
        matriz: [[2, 1], [1, 2]]
      - nombre: Triangular
        matriz: [[3, 1], [0, 2]]
      - nombre: Cizalla (una dirección)
        matriz: [[1, 1], [0, 1]]
      - nombre: Rotación (ninguna dirección real)
        matriz: [[0, -1], [1, 0]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Cuando una matriz deforma el plano, casi todas las flechas cambian de dirección. Pero suele haber algunas direcciones especiales que la matriz solo estira o encoge, sin girarlas: una flecha en esa dirección sale apuntando igual, más larga, más corta o invertida. Esas direcciones son los vectores propios, y el factor de estiramiento es el valor propio.

Conocerlas es conocer la matriz. Si una población de jóvenes y adultos evoluciona año con año multiplicando por una matriz, la dirección propia del valor propio más grande dice hacia qué proporción se estabiliza la población, y ese valor propio dice cuánto crece cada año. Aplicar la matriz muchas veces amplifica las direcciones con valor propio grande y apaga las de valor propio pequeño. Algunas matrices, como una rotación, no tienen ninguna dirección real que se conserve: sus valores propios son números complejos.

## Definición

:::definicion[Valor y vector propio]
Sea $A$ una matriz cuadrada de $n \times n$. Un escalar $\lambda$ es un **valor propio** de $A$ si existe un vector $\mathbf{v} \neq \mathbf{0}$ con
$$
A\mathbf{v} = \lambda\mathbf{v}.
$$
Ese $\mathbf{v}$ es un **vector propio** asociado a $\lambda$. Los vectores propios de $\lambda$, junto con el cero, forman el **espacio propio** $E_\lambda = N(A - \lambda I)$.
:::

La ecuación equivale a $(A - \lambda I)\mathbf{v} = \mathbf{0}$ con $\mathbf{v} \neq \mathbf{0}$, que tiene solución exactamente cuando $A - \lambda I$ es singular, es decir, cuando $\det(A - \lambda I) = 0$.

:::nota[Qué significa cada símbolo]
- $A$: matriz cuadrada de $n \times n$.
- $\mathbf{v}$: vector propio, distinto de cero.
- $\lambda$: valor propio, un número real o complejo.
- $I$: identidad.
- $A - \lambda I$: matriz que resta $\lambda$ a cada entrada de la diagonal.
- $E_\lambda$: espacio propio de $\lambda$.
- $N(\cdot)$: espacio nulo.
:::

## Cómo usar la visualización

El vector unitario $\mathbf{v}$ gira alrededor del círculo y junto a él se dibuja $A\mathbf{v}$. La curva punteada es el recorrido de $A\mathbf{v}$, la imagen del círculo. Cuando $A\mathbf{v}$ queda alineada con $\mathbf{v}$, la flecha se resalta y el panel muestra el valor propio, que es el cociente de las longitudes con signo.

En la matriz simétrica las dos alineaciones ocurren a 45 y 135 grados, perpendiculares entre sí. En la cizalla hay una sola dirección que no gira, la horizontal. En la rotación, $A\mathbf{v}$ siempre forma un ángulo recto con $\mathbf{v}$ y nunca se alinean: los valores propios son complejos.

## Ejemplo

Cada año, el 10 % de los habitantes de una ciudad se muda al campo y el 20 % de los del campo se muda a la ciudad. Con $\mathbf{x} = (\text{ciudad}, \text{campo})$, la población del año siguiente es $A\mathbf{x}$ con $A = \begin{pmatrix} 0.9 & 0.2 \\ 0.1 & 0.8 \end{pmatrix}$.

1. Se prueba $\mathbf{v}_1 = (2, 1)$: $A\mathbf{v}_1 = (1.8 + 0.2,\ 0.2 + 0.8) = (2, 1)$. Es vector propio con $\lambda_1 = 1$.
2. Se prueba $\mathbf{v}_2 = (1, -1)$: $A\mathbf{v}_2 = (0.9 - 0.2,\ 0.1 - 0.8) = (0.7, -0.7) = 0.7\,\mathbf{v}_2$. Es vector propio con $\lambda_2 = 0.7$.
3. Una población inicial $(600, 600)$ se escribe $400\,\mathbf{v}_1 - 200\,\mathbf{v}_2$.
4. Tras $k$ años: $A^k\mathbf{x} = 400\,\mathbf{v}_1 - 200(0.7)^k\mathbf{v}_2$. El segundo término se apaga.
5. A largo plazo la población tiende a $(800, 400)$: dos terceras partes en la ciudad, la proporción del vector propio de valor 1.

:::figura[La matriz de migración del ejemplo. El vector que gira se alinea con su imagen en la dirección (2, 1), donde no cambia de tamaño, y en la dirección (1, -1), donde se encoge a 0.7.]{componente="MatrixTransform"}
```yaml
modo: propios
matrices:
  - nombre: Migración
    matriz: [[0.9, 0.2], [0.1, 0.8]]
```
:::

## Propiedades

- **Número:** una matriz de $n \times n$ tiene $n$ valores propios contando multiplicidades, posiblemente complejos.
- **Suma y producto:** $\sum_i \lambda_i = \operatorname{tr}A$ y $\prod_i \lambda_i = \det A$.
- **Potencias:** si $A\mathbf{v} = \lambda\mathbf{v}$, entonces $A^k\mathbf{v} = \lambda^k\mathbf{v}$ y $A^{-1}\mathbf{v} = \lambda^{-1}\mathbf{v}$ si $A$ es invertible.
- **Independencia:** vectores propios de valores propios distintos son linealmente independientes.
- **Triangulares:** sus valores propios son las entradas de la diagonal.
- **Singularidad:** $A$ es singular si y solo si 0 es valor propio.
- **Simétricas:** tienen valores propios reales y vectores propios ortogonales.

:::figura[Casos según los valores propios: dos direcciones reales distintas, una sola dirección (cizalla) o ninguna dirección real (rotación). Las rectas punteadas marcan las direcciones propias cuando existen.]{componente="MatrixTransform"}
```yaml
modo: transformacion
propios: true
circulo: true
matrices:
  - nombre: Dos direcciones
    matriz: [[3, 1], [0, 2]]
  - nombre: Una dirección
    matriz: [[2, 1], [0, 2]]
  - nombre: Ninguna dirección real
    matriz: [[0.6, -0.8], [0.8, 0.6]]
```
:::

:::demostracion
Independencia para dos valores distintos: si $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 = \mathbf{0}$, aplicando $A$ queda $c_1\lambda_1\mathbf{v}_1 + c_2\lambda_2\mathbf{v}_2 = \mathbf{0}$. Restando $\lambda_2$ veces la primera ecuación: $c_1(\lambda_1 - \lambda_2)\mathbf{v}_1 = \mathbf{0}$, así que $c_1 = 0$, y entonces $c_2 = 0$.
:::

## Errores comunes

- **Aceptar $\mathbf{v} = \mathbf{0}$ como vector propio.** Siempre cumple $A\mathbf{0} = \lambda\mathbf{0}$; por eso se excluye.
- **Creer que el vector propio es único.** Cualquier múltiplo no nulo también lo es; se suele normalizar.
- **Calcular los valores propios de la forma escalonada.** Las operaciones de fila cambian los valores propios.
- **Suponer que toda matriz real tiene valores propios reales.** Las rotaciones son el contraejemplo.
- **Pensar que valor propio 0 es imposible.** Es posible y significa que la matriz aplasta esa dirección.

## Conexiones

Los vectores propios son direcciones que la [[multiplicacion-de-matrices-como-transformacion-lineal|transformación lineal]] no gira, y se calculan como el [[espacio-columna-espacio-fila-y-espacio-nulo|espacio nulo]] de $A - \lambda I$. Los valores propios son las raíces del [[polinomio-caracteristico]], cuyo producto es el [[determinante-como-factor-de-volumen|determinante]]. Con ellos se construyen la [[diagonalizacion]], el [[teorema-espectral]] y el [[metodo-de-la-potencia]], y se estudian las [[matrices-estocasticas]] de las cadenas de Markov.

## Formulario

:::formula[Ecuación de valores propios]
$$
A\mathbf{v} = \lambda\mathbf{v}, \qquad \mathbf{v} \neq \mathbf{0}
$$

- $\lambda$: valor propio.
- $\mathbf{v}$: vector propio.
:::

:::formula[Condición para los valores propios]
$$
\det(A - \lambda I) = 0
$$

- $A - \lambda I$: debe ser singular.
:::

:::formula[Espacio propio]
$$
E_\lambda = N(A - \lambda I)
$$

- $E_\lambda$: todos los vectores propios de $\lambda$ y el cero.
:::

:::formula[Traza, determinante y potencias]
$$
\sum_i \lambda_i = \operatorname{tr}A, \qquad \prod_i \lambda_i = \det A, \qquad A^k\mathbf{v} = \lambda^k\mathbf{v}
$$

- $\operatorname{tr}A$: suma de la diagonal.
- $k$: potencia entera.
:::
