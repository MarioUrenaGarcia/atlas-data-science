---
id: metodos-cuasi-newton
titulo: Métodos cuasi-Newton (BFGS, L-BFGS)
titulo_en: Quasi-Newton methods (BFGS, L-BFGS)
alias:
  - BFGS
  - L-BFGS
  - cuasi-Newton
  - ecuación de la secante
modulo: 0
submodulo: '0.6'
orden: 9
nivel: intermedio
prerrequisitos:
  - metodo-de-newton
  - busqueda-lineal
etiquetas:
  - BFGS
  - L-BFGS
  - cuasi-Newton
  - optimización
resumen: >
  Los métodos cuasi-Newton aproximan la inversa de la hessiana con los gradientes de pasos anteriores; BFGS
  actualiza una matriz completa y L-BFGS guarda solo los últimos pares de pasos.
formula: '\mathbf{H}_{k+1}\mathbf{y}_k = \mathbf{s}_k, \quad \mathbf{s}_k = \mathbf{x}_{k+1} - \mathbf{x}_k, \quad \mathbf{y}_k = \nabla f(\mathbf{x}_{k+1}) - \nabla f(\mathbf{x}_k)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: carrera
    funciones: [himmelblau, rosenbrock]
    metodos: [bfgs, lbfgs, gradiente-armijo]
    inicio: [0.5, -3]
referencias:
  - clave: boyd
    capitulo: '9.5'
  - clave: goodfellow
    capitulo: '8.6'
publicado: true
---

## Intuición

El método de Newton necesita la curvatura en cada paso, y calcular la hessiana completa de un modelo con miles de parámetros es impráctico. Pero la curvatura deja huellas en los gradientes: si al avanzar un paso el gradiente cambia mucho, la función está muy curvada en esa dirección; si apenas cambia, está casi plana. Los métodos cuasi-Newton aprovechan esas huellas para ir construyendo, paso a paso, una aproximación de la curvatura sin calcular nunca una segunda derivada.

BFGS mantiene una matriz que aproxima la inversa de la hessiana y la corrige en cada paso con una actualización de bajo costo, de modo que reproduzca exactamente el último cambio observado en el gradiente. L-BFGS hace lo mismo sin guardar la matriz: recuerda solo los últimos pocos pasos y gradientes, y con ellos reconstruye la dirección cuando la necesita. Es el método estándar para problemas suaves de tamaño mediano y grande, como la regresión logística con muchos atributos.

## Definición

:::definicion[Método cuasi-Newton]
Con una matriz $\mathbf{H}_k$ simétrica definida positiva que aproxima $\mathbf{H}_f(\mathbf{x}_k)^{-1}$:
$$
\mathbf{d}_k = -\mathbf{H}_k\,\nabla f(\mathbf{x}_k), \qquad \mathbf{x}_{k+1} = \mathbf{x}_k + \alpha_k\mathbf{d}_k,
$$
con $\alpha_k$ elegido por búsqueda lineal. La nueva aproximación debe cumplir la **ecuación de la secante** $\mathbf{H}_{k+1}\mathbf{y}_k = \mathbf{s}_k$.
:::

:::definicion[Actualización BFGS]
Con $\rho_k = 1/(\mathbf{y}_k^\top \mathbf{s}_k)$,
$$
\mathbf{H}_{k+1} = (\mathbf{I} - \rho_k\mathbf{s}_k\mathbf{y}_k^\top)\,\mathbf{H}_k\,(\mathbf{I} - \rho_k\mathbf{y}_k\mathbf{s}_k^\top) + \rho_k\mathbf{s}_k\mathbf{s}_k^\top.
$$
Si $\mathbf{y}_k^\top \mathbf{s}_k > 0$, la matriz sigue siendo definida positiva.
:::

**L-BFGS** no guarda $\mathbf{H}_k$: conserva los últimos $m$ pares $(\mathbf{s}_i, \mathbf{y}_i)$ y calcula $\mathbf{H}_k\nabla f$ con una recursión de dos ciclos, con costo proporcional a $mn$.

:::nota[Qué significa cada símbolo]
- $\mathbf{H}_k$: aproximación de la inversa de la hessiana en la iteración $k$.
- $\mathbf{d}_k$: dirección de búsqueda; $\alpha_k$: paso.
- $\mathbf{s}_k$: desplazamiento del último paso; $\mathbf{y}_k$: cambio del gradiente.
- $\rho_k$: inverso de $\mathbf{y}_k^\top \mathbf{s}_k$, positivo si la curvatura a lo largo del paso es positiva.
- $\mathbf{I}$: matriz identidad.
- $m$: número de pares que guarda L-BFGS; $n$: número de variables.
:::

## Cómo usar la visualización

Se comparan BFGS, L-BFGS y el gradiente con búsqueda de Armijo desde el mismo punto. El encabezado da el punto de cada método y su valor; el panel compara los valores. El selector cambia la función y los controles mueven el punto inicial.

En Rosenbrock, el gradiente avanza a pasitos por el valle, mientras BFGS y L-BFGS aprenden la forma del valle tras unos pasos y lo recorren a zancadas. En Himmelblau, los tres pueden terminar en mínimos distintos según el punto de partida.

## Ejemplo

Se dan los primeros pasos de BFGS sobre $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$ desde $(-2, 1)$, con $\mathbf{H}_0 = \mathbf{I}$.

1. $\nabla f(-2, 1) = (-5, 0)$, así que $\mathbf{d}_0 = (5, 0)$, la dirección del gradiente.
2. Búsqueda de Armijo: $\alpha = 1$ lleva a $(3, 1)$ con $f = 19 > 6.5 = f(-2, 1)$ y se rechaza; $\alpha = 0.5$ lleva a $(0.5, 1)$ con $f = 3.375$ y se acepta.
3. $\mathbf{s}_0 = (2.5, 0)$; $\nabla f(0.5, 1) = (2.5, 5)$, así que $\mathbf{y}_0 = (7.5, 5)$ y $\mathbf{y}_0^\top \mathbf{s}_0 = 18.75 > 0$.
4. La actualización da $\mathbf{H}_1 = \begin{pmatrix} 0.7778 & -0.6667 \\ -0.6667 & 1 \end{pmatrix}$; se comprueba que $\mathbf{H}_1\mathbf{y}_0 = (5.833 - 3.333,\ -5 + 5) = (2.5, 0) = \mathbf{s}_0$.
5. Nueva dirección: $\mathbf{d}_1 = -\mathbf{H}_1(2.5, 5) = (1.389, -3.333)$. Con $\alpha = 1$ se llega a $(1.889, -2.333)$, y tres pasos después el método está en $(1.0000, -1.0000)$ con cuatro decimales correctos.
6. La inversa verdadera es $\tfrac{1}{5}\begin{pmatrix} 3 & -2 \\ -2 & 3 \end{pmatrix}$; $\mathbf{H}_1$ ya captura su estructura de signos tras un solo paso.

:::figura[BFGS en el ejemplo: el primer paso sigue al gradiente; desde el segundo, la matriz aprendida tuerce la dirección hacia el mínimo (1, -1), que alcanza en pocos pasos.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [girada]
metodos: [bfgs]
inicio: [-2, 1]
```
:::

## Propiedades

- **Convergencia superlineal:** cerca de un mínimo con hessiana definida positiva, el error de BFGS se reduce más rápido que cualquier factor fijo por paso, aunque no cuadráticamente como Newton.
- **Cuadráticas:** con búsqueda exacta, BFGS encuentra el mínimo de una cuadrática de $n$ variables en a lo más $n$ pasos.
- **Costo:** BFGS cuesta del orden de $n^2$ operaciones y memoria por paso; L-BFGS, del orden de $mn$, con $m$ entre 3 y 20.
- **Positividad:** la condición de curvatura de Wolfe garantiza $\mathbf{y}_k^\top \mathbf{s}_k > 0$ y con ello que $\mathbf{H}_{k+1}$ siga definida positiva.
- **Solo gradientes:** no requieren segundas derivadas, lo que los hace aplicables cuando la hessiana es cara o no está disponible.

:::figura[En Rosenbrock desde (-1.2, 1), BFGS llega a menos de 0.001 de (1, 1) en 32 pasos y L-BFGS, con memoria de tres pares, en 39, mientras Newton, con la hessiana exacta, llega en siete.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [rosenbrock]
metodos: [bfgs, lbfgs, newton]
inicio: [-1.2, 1]
```
:::

## Errores comunes

- **Creer que $\mathbf{H}_k$ es la inversa de la hessiana.** Es una aproximación que solo coincide con ella en las direcciones exploradas por los pasos recientes.
- **Aceptar pasos sin condición de curvatura.** Si $\mathbf{y}_k^\top \mathbf{s}_k \le 0$, la actualización destruye la definida positividad; las implementaciones omiten la actualización en ese caso.
- **Pensar que se comportan como Newton cerca de un máximo.** Como $\mathbf{H}_k$ es siempre definida positiva, las direcciones son siempre de descenso y no buscan máximos.
- **Usar L-BFGS con ruido grande en los gradientes.** Las diferencias de gradientes ruidosos dan curvaturas falsas; con minilotes pequeños se prefieren métodos estocásticos.

:::figura[En Himmelblau, desde (-0.3, -0.9), cerca del máximo, BFGS baja hasta el mínimo (-3.78, -3.28), mientras que Newton desde el mismo punto se va al máximo.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [himmelblau]
metodos: [bfgs]
inicio: [-0.3, -0.9]
```
:::

## Conexiones

Imitan al [[metodo-de-newton]] sin calcular la [[matriz-hessiana]], y necesitan una [[busqueda-lineal]] con condiciones de Wolfe. La actualización mantiene la aproximación entre las [[matrices-definidas-positivas-y-semidefinidas]]. En cuadráticas se relacionan con el [[gradiente-conjugado]]. L-BFGS es el optimizador por defecto de muchas implementaciones de regresión logística y de otros modelos suaves.

## Formulario

:::formula[Dirección cuasi-Newton]
$$
\mathbf{d}_k = -\mathbf{H}_k\,\nabla f(\mathbf{x}_k)
$$

- $\mathbf{H}_k$: aproximación de la inversa de la hessiana.
:::

:::formula[Ecuación de la secante]
$$
\mathbf{H}_{k+1}\,\mathbf{y}_k = \mathbf{s}_k
$$

- $\mathbf{s}_k = \mathbf{x}_{k+1} - \mathbf{x}_k$; $\mathbf{y}_k = \nabla f(\mathbf{x}_{k+1}) - \nabla f(\mathbf{x}_k)$.
:::

:::formula[Actualización BFGS]
$$
\mathbf{H}_{k+1} = (\mathbf{I} - \rho_k\mathbf{s}_k\mathbf{y}_k^\top)\,\mathbf{H}_k\,(\mathbf{I} - \rho_k\mathbf{y}_k\mathbf{s}_k^\top) + \rho_k\mathbf{s}_k\mathbf{s}_k^\top
$$

- $\rho_k = 1/(\mathbf{y}_k^\top \mathbf{s}_k)$; $\mathbf{I}$: identidad.
:::

:::formula[Condición de curvatura]
$$
\mathbf{y}_k^\top \mathbf{s}_k > 0
$$

- Garantiza que $\mathbf{H}_{k+1}$ sea definida positiva.
:::
