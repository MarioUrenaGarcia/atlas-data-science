---
id: gradiente-conjugado
titulo: Gradiente conjugado
titulo_en: Conjugate gradient
alias:
  - método del gradiente conjugado
  - direcciones conjugadas
  - Fletcher-Reeves
  - Polak-Ribière
modulo: 0
submodulo: '0.6'
orden: 10
nivel: intermedio
prerrequisitos:
  - busqueda-lineal
  - formas-cuadraticas
etiquetas:
  - gradiente conjugado
  - direcciones conjugadas
  - sistemas lineales
  - optimización
resumen: >
  El gradiente conjugado elige direcciones que no deshacen el progreso de las anteriores; en una cuadrática
  de n variables con búsqueda exacta llega al mínimo en a lo más n pasos.
formula: '\mathbf{d}_{k+1} = -\nabla f(\mathbf{x}_{k+1}) + \beta_k\mathbf{d}_k, \qquad \mathbf{d}_i^\top \mathbf{A}\,\mathbf{d}_j = 0 \ (i \neq j)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: carrera
    funciones: [cuadratica, girada, rosenbrock]
    metodos: [gradiente-exacto, conjugado]
    inicio: [3, 1.5]
referencias:
  - clave: boyd
  - clave: strang
publicado: true
---

## Intuición

El descenso de gradiente con paso exacto tiene un defecto curioso: cada dirección es perpendicular a la anterior, y en un valle alargado eso produce una escalera de zigzags, donde cada paso deshace en parte el avance del anterior. El gradiente conjugado corrige esto mezclando el gradiente nuevo con la dirección anterior, de modo que lo que ya se minimizó en una dirección no se estropee en las siguientes.

Las direcciones resultantes no son perpendiculares en el sentido usual sino "conjugadas": perpendiculares cuando se miden con la forma del valle. En una cuadrática de $n$ variables, $n$ direcciones conjugadas bastan para llegar exactamente al mínimo. El método solo necesita gradientes y guarda una dirección, sin matrices, por lo que es el método preferido para resolver sistemas lineales grandes y dispersos, que equivalen a minimizar una cuadrática, y en su versión no lineal sirve para funciones suaves en general.

## Definición

Para la cuadrática $f(\mathbf{x}) = \tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$ con $\mathbf{A} \succ 0$, dos direcciones son **conjugadas** respecto de $\mathbf{A}$ si $\mathbf{d}_i^\top \mathbf{A}\,\mathbf{d}_j = 0$.

:::definicion[Gradiente conjugado]
Con $\mathbf{g}_k = \nabla f(\mathbf{x}_k)$ y $\mathbf{d}_0 = -\mathbf{g}_0$:
$$
\mathbf{x}_{k+1} = \mathbf{x}_k + \alpha_k\mathbf{d}_k, \qquad \mathbf{d}_{k+1} = -\mathbf{g}_{k+1} + \beta_k\mathbf{d}_k,
$$
donde $\alpha_k$ minimiza $f$ a lo largo de $\mathbf{d}_k$ y
$$
\beta_k = \frac{\mathbf{g}_{k+1}^\top \mathbf{g}_{k+1}}{\mathbf{g}_k^\top \mathbf{g}_k} \quad \text{(Fletcher-Reeves)}, \qquad
\beta_k = \frac{\mathbf{g}_{k+1}^\top (\mathbf{g}_{k+1} - \mathbf{g}_k)}{\mathbf{g}_k^\top \mathbf{g}_k} \quad \text{(Polak-Ribière)}.
$$
:::

En la cuadrática, $\alpha_k = \dfrac{\mathbf{g}_k^\top \mathbf{g}_k}{\mathbf{d}_k^\top \mathbf{A}\,\mathbf{d}_k}$ y ambas fórmulas de $\beta_k$ coinciden. Para funciones generales se usa una búsqueda lineal y, con Polak-Ribière, se reinicia con $\mathbf{d} = -\mathbf{g}$ cuando $\beta_k < 0$.

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz simétrica definida positiva de la cuadrática; $\mathbf{b}$: vector.
- $\mathbf{x}_k$: punto en la iteración $k$; $\mathbf{g}_k$: gradiente ahí.
- $\mathbf{d}_k$: dirección de búsqueda; $\alpha_k$: paso.
- $\beta_k$: coeficiente que mezcla la dirección anterior.
- $\mathbf{d}_i^\top \mathbf{A}\,\mathbf{d}_j = 0$: condición de conjugación.
:::

## Cómo usar la visualización

Se comparan el gradiente con paso exacto y el gradiente conjugado desde el mismo punto. El encabezado da el punto actual de cada método; el panel compara los valores. El selector cambia la función y los controles mueven el punto inicial.

En la cuadrática alargada, el gradiente con paso exacto avanza en escalera, con cada paso en ángulo recto con el anterior, mientras el conjugado llega al mínimo en dos pasos. En Rosenbrock, que no es cuadrática, el conjugado ya no termina en dos pasos, pero sigue siendo mucho más rápido que el gradiente.

## Ejemplo

Se minimiza $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$, con $\mathbf{A} = \begin{pmatrix} 3 & 2 \\ 2 & 3 \end{pmatrix}$ y $\mathbf{b} = (1, -1)$, desde $(-2, 1)$.

1. $\mathbf{g}_0 = (-5, 0)$ y $\mathbf{d}_0 = (5, 0)$. Paso: $\alpha_0 = \dfrac{25}{\mathbf{d}_0^\top \mathbf{A}\,\mathbf{d}_0} = \dfrac{25}{75} = \dfrac{1}{3}$, así que $\mathbf{x}_1 = \left(-\tfrac{1}{3}, 1\right)$.
2. $\mathbf{g}_1 = \left(3\left(-\tfrac{1}{3}\right) + 2 - 1,\ 2\left(-\tfrac{1}{3}\right) + 3 + 1\right) = (0, 3.3333)$.
3. $\beta_0 = \dfrac{11.111}{25} = 0.4444$ y $\mathbf{d}_1 = -\mathbf{g}_1 + 0.4444\,\mathbf{d}_0 = (2.2222, -3.3333)$.
4. Conjugación: $\mathbf{A}\,\mathbf{d}_1 = (0, -5.5556)$ y $\mathbf{d}_0^\top \mathbf{A}\,\mathbf{d}_1 = 5 \cdot 0 + 0 \cdot (-5.5556) = 0$.
5. $\alpha_1 = \dfrac{11.111}{\mathbf{d}_1^\top \mathbf{A}\,\mathbf{d}_1} = \dfrac{11.111}{18.519} = 0.6$, y $\mathbf{x}_2 = \left(-\tfrac{1}{3} + 1.3333,\ 1 - 2\right) = (1, -1)$, el mínimo exacto en dos pasos.

:::figura[El gradiente conjugado del ejemplo: un primer paso horizontal hasta (-0.33, 1) y un segundo paso, en la dirección conjugada (2.22, -3.33), que llega al mínimo (1, -1).]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [girada]
metodos: [conjugado]
inicio: [-2, 1]
```
:::

## Propiedades

- **Terminación finita:** en una cuadrática de $n$ variables con aritmética exacta, el mínimo se alcanza en a lo más $n$ pasos.
- **Gradientes ortogonales:** en la cuadrática, cada gradiente nuevo es perpendicular a todos los anteriores.
- **Sistemas lineales:** minimizar $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$ equivale a resolver $\mathbf{A}\mathbf{x} = \mathbf{b}$; el método solo usa productos $\mathbf{A}\mathbf{v}$, ideal para matrices dispersas.
- **Convergencia aproximada:** con $\kappa$ el número de condición, el error se reduce en cada paso por un factor de orden $\dfrac{\sqrt{\kappa} - 1}{\sqrt{\kappa} + 1}$, mucho mejor que $\dfrac{\kappa - 1}{\kappa + 1}$ del gradiente.
- **Memoria:** guarda solo el punto, el gradiente y una dirección.

:::figura[Desde (2.5, 1.5), el gradiente con paso exacto necesita 7 pasos para acercarse a menos de una millonésima del mínimo, con giros en ángulo recto; el conjugado llega exactamente en 2.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [girada]
metodos: [gradiente-exacto, conjugado]
inicio: [2.5, 1.5]
```
:::

## Errores comunes

- **Esperar terminación en $n$ pasos en funciones no cuadráticas.** La propiedad es exacta solo para cuadráticas; en Rosenbrock el método tarda 19 pasos en acercarse a menos de 0.001 del mínimo.
- **Confundir conjugadas con perpendiculares.** Las direcciones conjugadas son perpendiculares respecto de $\mathbf{A}$, no en el sentido usual, salvo que $\mathbf{A}$ sea múltiplo de la identidad.
- **Usar búsquedas lineales muy imprecisas.** La conjugación depende de pasos casi exactos; con pasos malos el método puede comportarse como el gradiente.
- **Olvidar reiniciar.** En funciones generales, reiniciar periódicamente con $-\mathbf{g}$ evita direcciones degradadas.

:::figura[El gradiente conjugado no lineal en Rosenbrock: ya no termina en dos pasos, porque la función no es cuadrática, y necesita 19 para llegar a menos de 0.001 de (1, 1).]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [rosenbrock]
metodos: [conjugado]
inicio: [-1.2, 1]
```
:::

## Conexiones

Mejora el [[descenso-de-gradiente]] con [[busqueda-lineal]] exacta, usando la geometría de las [[formas-cuadraticas]] y las [[matrices-definidas-positivas-y-semidefinidas]]. Resuelve [[sistemas-de-ecuaciones-lineales]] grandes, sobre todo con [[matrices-dispersas]], y su rapidez depende del [[numero-de-condicion]]. Comparte con los [[metodos-cuasi-newton]] la idea de aprovechar la información de pasos anteriores.

## Formulario

:::formula[Actualización de la dirección]
$$
\mathbf{d}_{k+1} = -\mathbf{g}_{k+1} + \beta_k\mathbf{d}_k
$$

- $\mathbf{g}_{k+1}$: gradiente nuevo; $\beta_k$: peso de la dirección anterior.
:::

:::formula[Coeficientes de Fletcher-Reeves y Polak-Ribière]
$$
\beta_k^{FR} = \frac{\mathbf{g}_{k+1}^\top \mathbf{g}_{k+1}}{\mathbf{g}_k^\top \mathbf{g}_k}, \qquad \beta_k^{PR} = \frac{\mathbf{g}_{k+1}^\top (\mathbf{g}_{k+1} - \mathbf{g}_k)}{\mathbf{g}_k^\top \mathbf{g}_k}
$$

- Coinciden en cuadráticas con búsqueda exacta.
:::

:::formula[Paso exacto en una cuadrática]
$$
\alpha_k = \frac{\mathbf{g}_k^\top \mathbf{g}_k}{\mathbf{d}_k^\top \mathbf{A}\,\mathbf{d}_k}
$$

- $\mathbf{A}$: matriz de la cuadrática.
:::

:::formula[Conjugación]
$$
\mathbf{d}_i^\top \mathbf{A}\,\mathbf{d}_j = 0, \quad i \neq j
$$

- $\mathbf{d}_i, \mathbf{d}_j$: direcciones de búsqueda distintas.
:::
