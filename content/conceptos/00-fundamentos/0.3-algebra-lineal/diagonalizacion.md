---
id: diagonalizacion
titulo: Diagonalización
titulo_en: Diagonalization
alias:
  - matriz diagonalizable
  - descomposición en valores propios
  - eigendescomposición
modulo: 0
submodulo: '0.3'
orden: 30
nivel: basico
prerrequisitos:
  - polinomio-caracteristico
  - cambio-de-base
etiquetas:
  - diagonalización
  - potencias de matrices
  - base de vectores propios
  - semejanza
resumen: >
  Una matriz es diagonalizable si tiene una base de vectores propios; entonces A = PDP^{-1}, con los
  vectores propios en P y los valores propios en la diagonal de D, y sus potencias se calculan fácilmente.
formula: '\mathbf{A} = \mathbf{P}\mathbf{D}\mathbf{P}^{-1}, \qquad \mathbf{A}^k = \mathbf{P}\mathbf{D}^kP^{-1}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: diagonalizacion
    matrices:
      - nombre: Diagonalizable
        matriz: [[2, 0], [1, 3]]
      - nombre: No diagonalizable (cizalla)
        matriz: [[2, 1], [0, 2]]
      - nombre: Valores propios complejos
        matriz: [[0, -1], [1, 0]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una matriz diagonal es la más fácil de entender: estira cada eje por su propio factor, sin mezclar coordenadas. Diagonalizar una matriz es encontrar unos ejes, tal vez inclinados, en los que ella también se comporta así. Esos ejes son sus vectores propios.

La receta tiene tres movimientos. Primero se traduce el punto a las coordenadas de los vectores propios; luego, en esas coordenadas, cada una se multiplica por su valor propio; y al final se traduce de regreso a las coordenadas usuales. Así, algo tan costoso como elevar una matriz a la potencia 100 se vuelve elevar cada valor propio a la potencia 100. No todas las matrices se dejan: una cizalla solo tiene una dirección propia en el plano y no alcanza para formar una base.

## Definición

:::definicion[Matriz diagonalizable]
$\mathbf{A} \in \mathbb{R}^{n \times n}$ es **diagonalizable** si existen una matriz invertible $\mathbf{P}$ y una diagonal $\mathbf{D}$ con
$$
\mathbf{A} = \mathbf{P}\mathbf{D}\mathbf{P}^{-1}.
$$
Las columnas de $\mathbf{P}$ son vectores propios de $\mathbf{A}$ y la diagonal de $\mathbf{D}$ contiene los valores propios correspondientes.
:::

:::teorema[Criterio]
$\mathbf{A}$ es diagonalizable si y solo si tiene $n$ vectores propios linealmente independientes. Esto ocurre, por ejemplo, si tiene $n$ valores propios distintos, y en general si para cada valor propio la multiplicidad geométrica es igual a la algebraica.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada de $n \times n$.
- $\mathbf{P}$: matriz cuyas columnas son vectores propios, invertible.
- $\mathbf{D} = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$: matriz diagonal con los valores propios.
- $\mathbf{P}^{-1}$: inversa de $\mathbf{P}$, que pasa a coordenadas de vectores propios.
- $k$: potencia entera.
- $n$: tamaño de la matriz.
:::

## Cómo usar la visualización

La reproducción aplica los tres factores uno a la vez sobre la rejilla y el círculo unitario: $\mathbf{P}^{-1}$ lleva los vectores propios $\mathbf{v}_1$ y $\mathbf{v}_2$ a los ejes, $\mathbf{D}$ estira cada eje por su valor propio y $\mathbf{P}$ regresa los ejes a las direcciones propias. El panel muestra valores y vectores propios y su producto punto.

Con la matriz diagonalizable, al final de la segunda fase la figura solo se estiró a lo largo de los ejes. Con la cizalla aparece un aviso: el valor propio 2 se repite con una sola dirección propia. Con la rotación, los valores propios son complejos y no hay factorización real.

## Ejemplo

Un modelo de dos especies usa $\mathbf{A} = \begin{pmatrix} 5 & -2 \\ 1 & 2 \end{pmatrix}$ para pasar de una generación a la siguiente. Se busca $\mathbf{A}^{10}$.

1. $p(\lambda) = \lambda^2 - 7\lambda + 12 = (\lambda - 4)(\lambda - 3)$.
2. Para $\lambda = 4$: $(\mathbf{A} - 4\mathbf{I})\mathbf{v} = \mathbf{0}$ con $\mathbf{A} - 4\mathbf{I} = \begin{pmatrix} 1 & -2 \\ 1 & -2 \end{pmatrix}$ da $\mathbf{v}_1 = (2, 1)$. Para $\lambda = 3$: $\mathbf{A} - 3\mathbf{I} = \begin{pmatrix} 2 & -2 \\ 1 & -1 \end{pmatrix}$ da $\mathbf{v}_2 = (1, 1)$.
3. $\mathbf{P} = \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix}$, $\mathbf{D} = \begin{pmatrix} 4 & 0 \\ 0 & 3 \end{pmatrix}$ y $\mathbf{P}^{-1} = \begin{pmatrix} 1 & -1 \\ -1 & 2 \end{pmatrix}$.
4. $\mathbf{A}^{10} = \mathbf{P}\mathbf{D}^{10}\mathbf{P}^{-1}$ con $\mathbf{D}^{10} = \operatorname{diag}(1048576, 59049)$.
5. La primera entrada es $2 \cdot 1048576 \cdot 1 + 1 \cdot 59049 \cdot (-1) = 2038103$. A la larga domina el valor propio 4 y las poblaciones se acercan a la proporción $2 : 1$ de $\mathbf{v}_1$.

:::figura[La matriz de las dos especies factorizada: un cambio a la base de vectores propios, un estiramiento por 4 y por 3 sobre los ejes y el regreso.]{componente="MatrixTransform"}
```yaml
modo: diagonalizacion
matrices:
  - nombre: Dos especies
    matriz: [[5, -2], [1, 2]]
```
:::

## Propiedades

- **Potencias y polinomios:** $\mathbf{A}^k = \mathbf{P}\mathbf{D}^kP^{-1}$ y, en general, $f(\mathbf{A}) = Pf(\mathbf{D})\mathbf{P}^{-1}$ para polinomios $f$.
- **Valores propios distintos:** si los $n$ valores propios son distintos, $\mathbf{A}$ es diagonalizable.
- **No única:** el orden de los valores propios y la escala de los vectores propios en $\mathbf{P}$ se pueden elegir.
- **Traza y determinante:** $\operatorname{tr}\mathbf{A} = \sum \lambda_i$ y $\det \mathbf{A} = \prod \lambda_i$, porque son invariantes de la semejanza.
- **Simétricas:** siempre son diagonalizables, y además con $\mathbf{P}$ ortogonal.
- **Estabilidad de un sistema $\mathbf{x}_{k+1} = \mathbf{A}\mathbf{x}_k$:** si todos los $|\lambda_i| < 1$, $\mathbf{x}_k \to \mathbf{0}$.

:::figura[Caso no diagonalizable: la cizalla con valor propio doble 2 solo conserva la dirección horizontal, marcada con la recta punteada. Una sola dirección no forma una base del plano.]{componente="MatrixTransform"}
```yaml
modo: transformacion
propios: true
circulo: true
matrices:
  - nombre: Cizalla con valor propio doble
    matriz: [[2, 1], [0, 2]]
```
:::

:::demostracion
Si $\mathbf{A}\mathbf{v}_i = \lambda_i\mathbf{v}_i$ para las columnas de $\mathbf{P}$, entonces $\mathbf{A}\mathbf{P} = [\lambda_1\mathbf{v}_1 \ \cdots \ \lambda_n\mathbf{v}_n] = \mathbf{P}\mathbf{D}$. Si las columnas son independientes, $\mathbf{P}$ es invertible y $\mathbf{A} = \mathbf{P}\mathbf{D}\mathbf{P}^{-1}$.
:::

## Errores comunes

- **Suponer que toda matriz es diagonalizable.** Las cizallas y otras matrices con valores propios repetidos pueden no serlo.
- **Confundir diagonalizable con invertible.** $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ es diagonal pero no invertible; la cizalla es invertible pero no diagonalizable.
- **Poner los vectores propios como filas de $\mathbf{P}$.** Van como columnas.
- **Olvidar el orden:** los valores propios de $\mathbf{D}$ deben corresponder, en la misma posición, a los vectores propios de $\mathbf{P}$.

## Conexiones

La diagonalización es un [[cambio-de-base]] a una base de [[valores-y-vectores-propios|vectores propios]], cuyos valores se obtienen del [[polinomio-caracteristico]]. Para matrices simétricas se convierte en el [[teorema-espectral]], y para matrices no cuadradas o no diagonalizables la generaliza la [[descomposicion-en-valores-singulares]]. El [[metodo-de-la-potencia]] aprovecha que al elevar a potencias domina el valor propio mayor, y el comportamiento a largo plazo de las cadenas de Markov se lee de la diagonalización de su matriz de transición.

## Formulario

:::formula[Diagonalización]
$$
\mathbf{A} = \mathbf{P}\mathbf{D}\mathbf{P}^{-1}, \qquad \mathbf{A}\mathbf{P} = \mathbf{P}\mathbf{D}
$$

- $\mathbf{P}$: vectores propios como columnas.
- $\mathbf{D}$: valores propios en la diagonal.
:::

:::formula[Potencias]
$$
\mathbf{A}^k = \mathbf{P}\mathbf{D}^kP^{-1}, \qquad \mathbf{D}^k = \operatorname{diag}(\lambda_1^k, \dots, \lambda_n^k)
$$

- $k$: potencia entera no negativa.
- $\lambda_i$: valores propios.
:::

:::formula[Criterio]
$$
\mathbf{A} \text{ diagonalizable} \iff \sum_{\lambda} \dim N(\mathbf{A} - \lambda \mathbf{I}) = n
$$

- $\dim N(\mathbf{A} - \lambda \mathbf{I})$: multiplicidad geométrica de $\lambda$.
- $n$: tamaño de $\mathbf{A}$.
:::
