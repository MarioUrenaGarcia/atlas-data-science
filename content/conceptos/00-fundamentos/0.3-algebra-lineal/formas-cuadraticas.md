---
id: formas-cuadraticas
titulo: Formas cuadráticas
titulo_en: Quadratic forms
alias:
  - forma cuadrática
  - ejes principales
  - cónicas
modulo: 0
submodulo: '0.3'
orden: 33
nivel: intermedio
prerrequisitos:
  - matrices-definidas-positivas-y-semidefinidas
etiquetas:
  - forma cuadrática
  - curvas de nivel
  - ejes principales
  - cónicas
resumen: >
  Una forma cuadrática es un polinomio homogéneo de grado 2, q(x) = x^T A x con A simétrica; al girar a los
  ejes propios se vuelve una suma de cuadrados con los valores propios como coeficientes.
formula: 'q(\mathbf{x}) = \mathbf{x}^\top \mathbf{A}\mathbf{x} = \sum_{i,j} a_{ij}x_ix_j = \sum_i \lambda_i y_i^2, \quad \mathbf{y} = \mathbf{Q}^\top\mathbf{x}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: forma-cuadratica
    matrices:
      - nombre: A
        matriz: [[3, 1], [1, 1]]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Expresiones como $2x^2 + 4xy + 5y^2$ aparecen al calcular energías, varianzas de combinaciones de variables o errores cuadráticos. Tienen solo términos de grado 2, y el término cruzado $xy$ es el que complica la lectura: hace que las curvas de nivel sean elipses inclinadas en lugar de alineadas con los ejes.

Toda forma cuadrática se escribe con una matriz simétrica, y el teorema espectral dice que siempre hay unos ejes perpendiculares, los ejes propios, en los que el término cruzado desaparece. En esos ejes la forma es simplemente $\lambda_1 u^2 + \lambda_2 v^2$. Los signos de los valores propios deciden la forma de las curvas de nivel: elipses si tienen el mismo signo, hipérbolas si tienen signos opuestos y pares de rectas si uno es cero. Sus tamaños deciden qué tan estrechas son: el semieje en la dirección de $\lambda_i$ es proporcional a $1/\sqrt{\lambda_i}$.

## Definición

:::definicion[Forma cuadrática]
Una **forma cuadrática** en $\mathbb{R}^n$ es una función
$$
q(\mathbf{x}) = \mathbf{x}^\top \mathbf{A}\mathbf{x} = \sum_{i=1}^{n}\sum_{j=1}^{n} a_{ij}\,x_i x_j,
$$
con $\mathbf{A}$ de $n \times n$. Como $\mathbf{x}^\top \mathbf{A}\mathbf{x} = \mathbf{x}^\top \mathbf{S}\mathbf{x}$ con $\mathbf{S} = \tfrac{1}{2}(\mathbf{A} + \mathbf{A}^\top)$, siempre se puede tomar la matriz simétrica.
:::

:::teorema[Ejes principales]
Si $\mathbf{S} = \mathbf{Q}\boldsymbol{\\Lambda} \mathbf{Q}^\top$ y $\mathbf{y} = \mathbf{Q}^\top\mathbf{x}$, entonces
$$
q(\mathbf{x}) = \lambda_1 y_1^2 + \dots + \lambda_n y_n^2.
$$
Las columnas de $\mathbf{Q}$ son los **ejes principales** de las curvas de nivel $q(\mathbf{x}) = c$.
:::

:::nota[Qué significa cada símbolo]
- $q$: forma cuadrática, una función de $\mathbb{R}^n$ en $\mathbb{R}$.
- $\mathbf{x} = (x_1, \dots, x_n)$: vector de variables.
- $\mathbf{A}$: matriz de coeficientes; $a_{ij}$ sus entradas.
- $\mathbf{S}$: parte simétrica de $\mathbf{A}$.
- $\mathbf{Q}$: matriz ortogonal de vectores propios de $\mathbf{S}$.
- $\boldsymbol{\\Lambda}$: matriz diagonal de valores propios $\lambda_i$.
- $\mathbf{y}$: coordenadas de $\mathbf{x}$ en los ejes principales.
- $c$: nivel de la curva $q(\mathbf{x}) = c$.
:::

## Cómo usar la visualización

Las cuatro entradas de $\mathbf{A}$ se editan. Se dibujan las curvas de nivel de $q$ para los valores $\pm 0.5, \pm 1, \pm 2, \pm 4$, azules las positivas y naranjas las negativas, y los ejes principales punteados. La fórmula muestra la parte simétrica $\mathbf{S}$ que realmente usa la forma. El punto $\mathbf{x}$ se arrastra para leer $q(\mathbf{x})$.

Al cambiar solo $b$ y $c$ manteniendo su suma, la parte simétrica y las curvas no cambian. Al llevar $d$ a un valor negativo las elipses se abren en hipérbolas. Al hacer $b = c = 0$ los ejes principales se alinean con los ejes $x$ y $y$.

## Ejemplo

La energía de deformación de una placa es $q(x, y) = 2x^2 + 4xy + 5y^2$.

1. Matriz simétrica: $\mathbf{S} = \begin{pmatrix} 2 & 2 \\ 2 & 5 \end{pmatrix}$; el término $4xy$ se reparte como 2 en cada posición fuera de la diagonal.
2. $p(\lambda) = \lambda^2 - 7\lambda + 6$: valores propios 6 y 1, ambos positivos, así que $q$ es definida positiva.
3. Ejes: para $\lambda = 6$, $(1, 2)/\sqrt{5}$; para $\lambda = 1$, $(2, -1)/\sqrt{5}$.
4. En esos ejes $q = 6u^2 + v^2$. La curva $q = 6$ es una elipse con semiejes $1$ en la dirección $(1, 2)$ y $\sqrt{6} \approx 2.45$ en la dirección $(2, -1)$.
5. Comprobación en $\mathbf{x} = (1, 2)/\sqrt{5}$: $q = (2 + 8 + 20)/5 = 6$.

:::figura[La energía de la placa. La matriz dada no es simétrica, pero su parte simétrica es la del ejemplo: las elipses están alineadas con las direcciones (1, 2) y (2, -1).]{componente="MatrixTransform"}
```yaml
modo: forma-cuadratica
matrices:
  - nombre: Placa
    matriz: [[2, 3], [1, 5]]
```
:::

## Propiedades

- **Homogeneidad:** $q(c\,\mathbf{x}) = c^2 q(\mathbf{x})$.
- **Forma de las curvas en el plano:** elipses si $\lambda_1\lambda_2 > 0$, hipérbolas si $\lambda_1\lambda_2 < 0$, rectas paralelas si uno es cero.
- **Semiejes:** la curva $q = c$ con $\lambda_i > 0$ tiene semiejes $\sqrt{c/\lambda_i}$ en las direcciones propias.
- **Extremos en la esfera:** el máximo y mínimo de $q$ con $\lVert \mathbf{x} \rVert = 1$ son $\lambda_{\max}$ y $\lambda_{\min}$.
- **Gradiente:** $\nabla q(\mathbf{x}) = 2\mathbf{S}\mathbf{x}$, perpendicular a las curvas de nivel.
- **Completar cuadrados:** la reducción a suma de cuadrados también puede hacerse completando cuadrados, que es la factorización $\mathbf{S} = LDL^\top$.

:::figura[Casos de curvas de nivel: una forma indefinida produce hipérbolas y una semidefinida produce pares de rectas paralelas.]{componente="MatrixTransform"}
```yaml
modo: forma-cuadratica
matrices:
  - nombre: Hipérbolas, x² - y²
    matriz: [[1, 0], [0, -1]]
  - nombre: Rectas, (x + y)²
    matriz: [[1, 1], [1, 1]]
  - nombre: Hipérbolas giradas, 2xy
    matriz: [[0, 1], [1, 0]]
```
:::

:::demostracion
Con $\mathbf{x} = \mathbf{Q}\mathbf{y}$: $q(\mathbf{x}) = \mathbf{y}^\top \mathbf{Q}^\top \mathbf{S}\mathbf{Q}\mathbf{y} = \mathbf{y}^\top\boldsymbol{\\Lambda}\mathbf{y} = \sum_i \lambda_i y_i^2$.
:::

## Errores comunes

- **Poner el coeficiente del término cruzado completo en una sola posición y creer que la matriz es simétrica.** En $4xy$ se pone 2 en $(1, 2)$ y 2 en $(2, 1)$.
- **Leer los semiejes como $\lambda_i$.** Son $\sqrt{c/\lambda_i}$: el valor propio grande da el eje corto.
- **Confundir forma cuadrática con función cuadrática.** $x^2 + 3x + 1$ tiene términos de grado 1 y 0; no es forma cuadrática.
- **Usar los ejes $x$ y $y$ para clasificar.** Con término cruzado, los coeficientes de $x^2$ y $y^2$ pueden ser positivos y la forma ser indefinida.

## Conexiones

Una forma cuadrática es definida, semidefinida o indefinida según la matriz, como en [[matrices-definidas-positivas-y-semidefinidas]], y sus ejes principales vienen del [[teorema-espectral]]. La expresión $\mathbf{x}^\top \mathbf{A}\mathbf{x}$ generaliza el [[producto-punto]] y la norma al cuadrado. Aparece en la distancia de Mahalanobis, en el exponente de la distribución normal multivariada y en las funciones de pérdida cuadrática de la regresión.

## Formulario

:::formula[Forma cuadrática]
$$
q(\mathbf{x}) = \mathbf{x}^\top \mathbf{A}\mathbf{x} = \sum_{i,j} a_{ij}x_ix_j
$$

- $a_{ij}$: entradas de la matriz.
- $x_i$: componentes del vector.
:::

:::formula[Parte simétrica]
$$
\mathbf{S} = \tfrac{1}{2}(\mathbf{A} + \mathbf{A}^\top), \qquad \mathbf{x}^\top \mathbf{A}\mathbf{x} = \mathbf{x}^\top \mathbf{S}\mathbf{x}
$$

- $\mathbf{S}$: matriz simétrica asociada a la forma.
:::

:::formula[Ejes principales]
$$
q(\mathbf{x}) = \sum_i \lambda_i y_i^2, \qquad \mathbf{y} = \mathbf{Q}^\top\mathbf{x}
$$

- $\lambda_i$: valores propios de $\mathbf{S}$.
- $\mathbf{Q}$: vectores propios ortonormales de $\mathbf{S}$.
:::

:::formula[Semiejes y extremos]
$$
\text{semieje}_i = \sqrt{c/\lambda_i}, \qquad \lambda_{\min} \le q(\mathbf{x}) \le \lambda_{\max} \ \text{ si } \lVert \mathbf{x} \rVert = 1
$$

- $c$: nivel de la curva, con el mismo signo que $\lambda_i$.
:::
