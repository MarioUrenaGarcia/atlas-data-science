---
id: matrices-definidas-positivas-y-semidefinidas
titulo: Matrices definidas positivas y semidefinidas
titulo_en: Positive definite and semidefinite matrices
alias:
  - matriz definida positiva
  - matriz semidefinida positiva
  - matriz indefinida
  - criterio de Sylvester
modulo: 0
submodulo: '0.3'
orden: 32
nivel: intermedio
prerrequisitos:
  - teorema-espectral
etiquetas:
  - definida positiva
  - covarianza
  - convexidad
  - valores propios
resumen: >
  Una matriz simétrica es definida positiva si x^T A x > 0 para todo x no nulo, lo que equivale a que
  todos sus valores propios sean positivos; semidefinida si x^T A x >= 0. Las covarianzas son semidefinidas.
formula: 'A \succ 0 \iff \mathbf{x}^\top A\mathbf{x} > 0 \ \ \forall\,\mathbf{x} \neq \mathbf{0} \iff \lambda_i > 0 \ \ \forall\, i'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: forma-cuadratica
    matrices:
      - nombre: Definida positiva
        matriz: [[2, 1], [1, 2]]
      - nombre: Semidefinida positiva
        matriz: [[1, 1], [1, 1]]
      - nombre: Indefinida
        matriz: [[1, 2], [2, -1]]
      - nombre: Definida negativa
        matriz: [[-2, 1], [1, -1]]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Una matriz simétrica $A$ define una especie de "energía" $\mathbf{x}^\top A\mathbf{x}$ para cada vector. Cuando esa energía es positiva en todas las direcciones, la superficie $z = \mathbf{x}^\top A\mathbf{x}$ es un tazón que abre hacia arriba con el fondo en el origen, y sus curvas de nivel son elipses. Esas matrices se llaman definidas positivas y son las que representan una curvatura hacia arriba en todas las direcciones.

Si en alguna dirección la energía es cero, el tazón se convierte en un canal plano: la matriz es semidefinida. Si en unas direcciones es positiva y en otras negativa, la superficie es una silla de montar y la matriz es indefinida. Las matrices de covarianza siempre son al menos semidefinidas, porque la varianza de cualquier combinación de variables no puede ser negativa. En optimización, un mínimo local se reconoce porque la matriz de segundas derivadas es definida positiva.

## Definición

:::definicion[Clasificación]
Sea $A \in \mathbb{R}^{n \times n}$ simétrica. $A$ es
- **definida positiva** ($A \succ 0$) si $\mathbf{x}^\top A\mathbf{x} > 0$ para todo $\mathbf{x} \neq \mathbf{0}$;
- **semidefinida positiva** ($A \succeq 0$) si $\mathbf{x}^\top A\mathbf{x} \ge 0$ para todo $\mathbf{x}$;
- **definida** o **semidefinida negativa** si $-A$ es definida o semidefinida positiva;
- **indefinida** si $\mathbf{x}^\top A\mathbf{x}$ toma valores positivos y negativos.
:::

:::teorema[Criterios equivalentes]
Para $A$ simétrica son equivalentes: (1) $A \succ 0$; (2) todos sus valores propios son positivos; (3) todos los menores principales dominantes $\det A_{1:k,1:k}$ son positivos (criterio de Sylvester); (4) $A = LL^\top$ con $L$ triangular inferior de diagonal positiva; (5) $A = B^\top B$ con $B$ de columnas independientes.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz simétrica de $n \times n$.
- $\mathbf{x}$: vector cualquiera de $\mathbb{R}^n$.
- $\mathbf{x}^\top A\mathbf{x}$: forma cuadrática, un número.
- $\succ 0$, $\succeq 0$: definida y semidefinida positiva.
- $\lambda_i$: valores propios de $A$.
- $A_{1:k,1:k}$: submatriz de las primeras $k$ filas y columnas.
- $L$: factor de Cholesky; $B$: matriz cualquiera con $A = B^\top B$.
:::

## Cómo usar la visualización

El selector elige una matriz. Las curvas azules son los puntos con $\mathbf{x}^\top A\mathbf{x}$ positivo e igual a 0.5, 1, 2 y 4; las naranjas, con valor negativo. Las rectas punteadas son los ejes propios. El punto $\mathbf{x}$ se arrastra y el panel muestra el valor de la forma, los valores propios y la clasificación.

En la definida positiva todas las curvas son elipses azules. En la semidefinida se vuelven pares de rectas paralelas: a lo largo de la dirección $(1, -1)$ el valor es cero. En la indefinida aparecen hipérbolas de ambos colores, y en la definida negativa todas las elipses son naranjas.

## Ejemplo

Se revisa si $A = \begin{pmatrix} 4 & 2 \\ 2 & 3 \end{pmatrix}$, la matriz de segundas derivadas de una función de costo, es definida positiva.

1. Criterio de Sylvester: $a_{11} = 4 > 0$ y $\det A = 12 - 4 = 8 > 0$. Es definida positiva.
2. Valores propios: $\lambda = \tfrac{7 \pm \sqrt{49 - 32}}{2} = \tfrac{7 \pm \sqrt{17}}{2}$, es decir, $5.56$ y $1.44$, ambos positivos.
3. Prueba directa con $\mathbf{x} = (1, -1)$: $\mathbf{x}^\top A\mathbf{x} = 4 - 2 - 2 + 3 = 3 > 0$.
4. Forma general: $4x^2 + 4xy + 3y^2 = (2x + y)^2 + 2y^2$, suma de cuadrados que solo vale cero en el origen.
5. Conclusión: la función de costo tiene curvatura positiva en todas las direcciones y su punto crítico es un mínimo.

:::figura[La matriz del ejemplo con entradas editables: sus curvas de nivel son elipses alrededor del origen. Al bajar la entrada (2, 2) hasta 1 el determinante se anula y las elipses se abren en rectas.]{componente="MatrixTransform"}
```yaml
modo: forma-cuadratica
matrices:
  - nombre: Costo
    matriz: [[4, 2], [2, 3]]
```
:::

## Propiedades

- **Diagonal positiva:** si $A \succ 0$, todas sus entradas diagonales son positivas.
- **Invertibilidad:** una definida positiva es invertible y su inversa también es definida positiva.
- **Matrices de Gram:** $B^\top B$ siempre es semidefinida positiva, y definida positiva si $B$ tiene columnas independientes.
- **Suma:** la suma de semidefinidas es semidefinida; sumar $\epsilon I$ con $\epsilon > 0$ convierte una semidefinida en definida.
- **Covarianzas:** toda matriz de covarianzas cumple $\operatorname{Var}(\mathbf{w}^\top X) = \mathbf{w}^\top\Sigma\mathbf{w} \ge 0$.
- **Raíz cuadrada:** si $A \succeq 0$ existe una única $A^{1/2} \succeq 0$ con $(A^{1/2})^2 = A$.

:::figura[Prueba práctica de definición positiva: la factorización de Cholesky de la matriz del ejemplo termina sin problemas, mientras que en una matriz indefinida aparece un número negativo bajo la raíz.]{componente="MatrixSteps"}
```yaml
modo: cholesky
matrices:
  - nombre: Definida positiva
    matriz: [[4, 2], [2, 3]]
  - nombre: Indefinida
    matriz: [[1, 2], [2, 1]]
```
:::

:::demostracion
Valores propios positivos implican definida positiva: con $A = Q\Lambda Q^\top$ y $\mathbf{y} = Q^\top\mathbf{x}$, $\mathbf{x}^\top A\mathbf{x} = \mathbf{y}^\top\Lambda\mathbf{y} = \sum \lambda_i y_i^2$, que es positivo si todos los $\lambda_i > 0$ y $\mathbf{y} \neq \mathbf{0}$, lo cual ocurre porque $Q$ es invertible.
:::

## Errores comunes

- **Revisar solo que las entradas sean positivas.** $\begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix}$ tiene entradas positivas y es indefinida.
- **Aplicar el criterio de Sylvester a semidefinidas.** Para semidefinidas hay que revisar todos los menores principales, no solo los dominantes.
- **Clasificar matrices no simétricas sin simetrizarlas.** La forma $\mathbf{x}^\top A\mathbf{x}$ solo depende de $\tfrac{1}{2}(A + A^\top)$.
- **Suponer que una covarianza estimada siempre es invertible.** Con más variables que observaciones es semidefinida pero singular.

## Conexiones

La clasificación se obtiene del [[teorema-espectral]]: los signos de los valores propios deciden todo. La expresión $\mathbf{x}^\top A\mathbf{x}$ se estudia en [[formas-cuadraticas]], y la [[descomposicion-de-cholesky]] existe exactamente para las definidas positivas. En probabilidad, las matrices de covarianza son semidefinidas positivas, y en optimización la definición positiva del hessiano caracteriza los mínimos y la convexidad estricta.

## Formulario

:::formula[Definición]
$$
A \succ 0 \iff \mathbf{x}^\top A\mathbf{x} > 0 \ \ \forall\,\mathbf{x} \neq \mathbf{0}
$$

- $A$: matriz simétrica.
- $\mathbf{x}$: vector no nulo.
:::

:::formula[Criterio de valores propios]
$$
A \succ 0 \iff \lambda_i > 0, \qquad A \succeq 0 \iff \lambda_i \ge 0
$$

- $\lambda_i$: valores propios de $A$.
:::

:::formula[Criterio de Sylvester]
$$
A \succ 0 \iff \det A_{1:k,\,1:k} > 0, \quad k = 1, \dots, n
$$

- $A_{1:k,\,1:k}$: menor principal dominante de orden $k$.
:::

:::formula[Gram y covarianza]
$$
B^\top B \succeq 0, \qquad \mathbf{w}^\top\Sigma\,\mathbf{w} = \operatorname{Var}(\mathbf{w}^\top X) \ge 0
$$

- $B$: matriz cualquiera.
- $\Sigma$: matriz de covarianzas del vector aleatorio $X$.
- $\mathbf{w}$: vector de pesos.
:::
