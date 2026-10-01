---
id: metodo-de-la-potencia
titulo: Método de la potencia
titulo_en: Power method
alias:
  - iteración de la potencia
  - power iteration
  - cociente de Rayleigh
modulo: 0
submodulo: '0.3'
orden: 43
nivel: intermedio
prerrequisitos:
  - valores-y-vectores-propios
  - normas-vectoriales
etiquetas:
  - método iterativo
  - valor propio dominante
  - convergencia
  - PageRank
resumen: >
  El método de la potencia multiplica repetidamente un vector por A y lo normaliza; converge a la dirección
  del valor propio de mayor módulo, con rapidez dada por el cociente |lambda_2 / lambda_1|.
formula: '\mathbf{x}_{k+1} = \frac{\mathbf{A}\mathbf{x}_k}{\lVert \mathbf{A}\mathbf{x}_k \rVert}, \qquad \lambda_1 \approx \mathbf{x}_k^\top \mathbf{A}\mathbf{x}_k'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: potencia
    anguloInicial: 100
    matrices:
      - nombre: Convergencia rápida
        matriz: [[4, 1], [1, 1]]
      - nombre: Convergencia lenta
        matriz: [[2, 0.2], [0.2, 1.8]]
      - nombre: Dominante negativo
        matriz: [[-3, 1], [1, 1]]
      - nombre: Sin dominante real (rotación)
        matriz: [[0, -1], [1, 0]]
referencias:
  - clave: strang
  - clave: murphy
publicado: true
---

## Intuición

Si una matriz estira una dirección más que todas las demás, aplicarla una y otra vez hace que esa dirección gane. Cualquier vector inicial tiene un poco de cada dirección propia; en cada multiplicación la componente del valor propio más grande crece más que las otras, y después de varias vueltas prácticamente es lo único que queda. Como el vector crece o se encoge sin control, se normaliza en cada paso para seguir solo su dirección.

Es la forma más sencilla de obtener un vector propio y es sorprendentemente útil: el algoritmo PageRank, que ordena páginas web por importancia, es el método de la potencia aplicado a una matriz enorme de enlaces. Solo necesita multiplicar por la matriz, lo que resulta barato cuando esta es dispersa. Su debilidad es la velocidad: si el segundo valor propio es casi tan grande como el primero, la separación entre ellos es lenta.

## Definición

:::definicion[Método de la potencia]
Dada $\mathbf{A} \in \mathbb{R}^{n \times n}$ y un vector inicial $\mathbf{x}_0$ con $\lVert \mathbf{x}_0 \rVert = 1$, se itera
$$
\mathbf{x}_{k+1} = \frac{\mathbf{A}\mathbf{x}_k}{\lVert \mathbf{A}\mathbf{x}_k \rVert}, \qquad \rho_k = \mathbf{x}_k^\top \mathbf{A}\mathbf{x}_k.
$$
$\rho_k$ es el **cociente de Rayleigh**, la estimación del valor propio.
:::

:::teorema[Convergencia]
Si $\mathbf{A}$ es diagonalizable con valores propios $|\lambda_1| > |\lambda_2| \ge \dots \ge |\lambda_n|$ y $\mathbf{x}_0$ tiene componente no nula en la dirección de $\mathbf{v}_1$, entonces $\mathbf{x}_k$ se acerca a $\pm\mathbf{v}_1$ y el error decrece como $|\lambda_2/\lambda_1|^k$. Para $\mathbf{A}$ simétrica, $\rho_k \to \lambda_1$ con error del orden de $|\lambda_2/\lambda_1|^{2k}$.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz cuadrada.
- $\mathbf{x}_k$: iterado normalizado en el paso $k$.
- $\lVert \cdot \rVert$: norma euclidiana.
- $\rho_k$: cociente de Rayleigh, estimación de $\lambda_1$.
- $\lambda_1$: valor propio dominante, el de mayor módulo; $\mathbf{v}_1$ su vector propio.
- $\lambda_2$: segundo valor propio en módulo.
- $|\lambda_2/\lambda_1|$: razón que controla la velocidad.
:::

## Cómo usar la visualización

La flecha amarilla es el iterado actual y las grises los anteriores; la recta punteada es la dirección propia dominante. Cada paso multiplica por $\mathbf{A}$ y normaliza. El panel muestra el iterado, la estimación de $\lambda_1$, los valores propios exactos, el seno del ángulo con la dirección dominante y la razón $|\lambda_2/\lambda_1|$.

Con convergencia rápida la flecha se pega a la recta en dos o tres pasos. Con convergencia lenta, la razón es 0.79 y el ángulo se cierra poco a poco. Con dominante negativo, la flecha salta de un lado al otro de la recta en cada paso, pero la recta es la correcta. Con la rotación la flecha gira sin detenerse.

## Ejemplo

Se estima el valor propio dominante de $\mathbf{A} = \begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix}$, la matriz de interacción de dos especies, empezando en $\mathbf{x}_0 = (1, 0)$.

1. $\mathbf{A}\mathbf{x}_0 = (2, 1)$, norma $\sqrt{5}$: $\mathbf{x}_1 = (0.894, 0.447)$.
2. $\mathbf{A}\mathbf{x}_1 = (2.236, 2.236)$: $\mathbf{x}_2 = (0.707, 0.707)$.
3. $\mathbf{A}\mathbf{x}_2 = (2.121, 2.828)$, norma $3.536$: $\mathbf{x}_3 = (0.6, 0.8)$.
4. $\mathbf{A}\mathbf{x}_3 = (2.0, 3.0)$ y $\rho_3 = 0.6 \cdot 2 + 0.8 \cdot 3 = 3.6$.
5. El valor exacto es $\lambda_1 = (5 + \sqrt{5})/2 \approx 3.618$: en tres pasos el error es menor al 1 %, porque $|\lambda_2/\lambda_1| = 1.382/3.618 \approx 0.38$.

:::figura[La matriz del ejemplo iterada desde el vector (1, 0): los iterados se acercan rápidamente a la dirección dominante y la estimación pasa de 2 a 3.618.]{componente="MatrixTransform"}
```yaml
modo: potencia
anguloInicial: 0
matrices:
  - nombre: Especies
    matriz: [[2, 1], [1, 3]]
```
:::

## Propiedades

- **Costo por paso:** una multiplicación matriz por vector, del orden de $n^2$ operaciones, o de las entradas no nulas si la matriz es dispersa.
- **Velocidad lineal:** el error se multiplica por $|\lambda_2/\lambda_1|$ en cada paso.
- **Falla sin dominante:** si $|\lambda_1| = |\lambda_2|$, como en rotaciones o con $\lambda_1 = -\lambda_2$, no hay convergencia de la dirección.
- **Potencia inversa:** aplicar el método a $\mathbf{A}^{-1}$ encuentra el valor propio de menor módulo; con $(\mathbf{A} - sI)^{-1}$, el más cercano a $s$.
- **Deflación:** una vez hallado $\lambda_1$, se puede restar su contribución para buscar el siguiente.
- **Cadenas de Markov:** con una matriz estocástica, iterar la distribución es el método de la potencia con valor propio dominante 1.

:::figura[Caso de convergencia lenta: con valores propios 2.12 y 1.68 la razón es 0.79 y los iterados tardan muchos pasos en alinearse.]{componente="MatrixTransform"}
```yaml
modo: potencia
anguloInicial: 150
matrices:
  - nombre: Valores propios cercanos
    matriz: [[2, 0.2], [0.2, 1.8]]
```
:::

:::demostracion
Si $\mathbf{x}_0 = \sum c_i\mathbf{v}_i$ con $c_1 \neq 0$, entonces $\mathbf{A}^k\mathbf{x}_0 = \lambda_1^k\big(c_1\mathbf{v}_1 + \sum_{i\ge2} c_i(\lambda_i/\lambda_1)^k\mathbf{v}_i\big)$. Cada término con $i \ge 2$ se multiplica por un factor de módulo menor que 1 elevado a $k$ y tiende a cero; la normalización solo cambia la escala.
:::

## Errores comunes

- **No normalizar.** Sin normalizar, los números crecen o decrecen hasta desbordarse.
- **Empezar con un vector sin componente dominante.** Si $\mathbf{x}_0$ es perpendicular a $\mathbf{v}_1$ en una matriz simétrica, en aritmética exacta nunca converge a él; en la práctica el redondeo suele rescatarlo, pero lentamente.
- **Declarar convergencia porque la flecha se estabiliza en longitud.** Hay que vigilar la dirección y el cambio del cociente de Rayleigh.
- **Esperar convergencia con valores propios complejos dominantes.** El iterado gira indefinidamente.

## Conexiones

El método de la potencia aprovecha la estructura de [[valores-y-vectores-propios]] y la [[diagonalizacion]] de $\mathbf{A}^k$, y usa [[normas-vectoriales]] para normalizar. Es el algoritmo natural para las [[matrices-estocasticas]] y para las [[matrices-dispersas]]. En ciencia de datos se usa para obtener la primera componente principal de grandes conjuntos de datos y para calcular la centralidad de nodos en redes.

## Formulario

:::formula[Iteración]
$$
\mathbf{x}_{k+1} = \frac{\mathbf{A}\mathbf{x}_k}{\lVert \mathbf{A}\mathbf{x}_k \rVert}
$$

- $\mathbf{x}_k$: iterado normalizado.
:::

:::formula[Cociente de Rayleigh]
$$
\rho_k = \frac{\mathbf{x}_k^\top \mathbf{A}\mathbf{x}_k}{\mathbf{x}_k^\top\mathbf{x}_k}
$$

- $\rho_k$: estimación de $\lambda_1$.
:::

:::formula[Velocidad de convergencia]
$$
\text{error}_k \approx C\,\Big|\frac{\lambda_2}{\lambda_1}\Big|^k
$$

- $C$: constante que depende del vector inicial.
- $\lambda_1, \lambda_2$: los dos valores propios de mayor módulo.
:::
