---
id: numero-de-condicion
titulo: Número de condición
titulo_en: Condition number
alias:
  - condicionamiento
  - matriz mal condicionada
  - kappa
modulo: 0
submodulo: '0.3'
orden: 40
nivel: intermedio
prerrequisitos:
  - normas-matriciales
  - sistemas-de-ecuaciones-lineales
etiquetas:
  - condicionamiento
  - sensibilidad
  - errores numéricos
  - estabilidad
resumen: >
  El número de condición kappa(A) = sigma_max / sigma_min mide cuánto puede amplificar un sistema Ax = b los
  errores relativos de los datos; si es grande, pequeños cambios en b producen grandes cambios en x.
formula: '\kappa(A) = \lVert A \rVert\,\lVert A^{-1} \rVert = \frac{\sigma_{\max}}{\sigma_{\min}}, \qquad \frac{\lVert \Delta\mathbf{x} \rVert}{\lVert \mathbf{x} \rVert} \le \kappa(A)\,\frac{\lVert \Delta\mathbf{b} \rVert}{\lVert \mathbf{b} \rVert}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: estiramiento
    matrices:
      - nombre: Bien condicionada
        matriz: [[2, 0.5], [0.5, 1.5]]
      - nombre: Mal condicionada
        matriz: [[1, 1], [1, 1.05]]
      - nombre: Ortogonal (condición 1)
        matriz: [[0.8, 0.6], [-0.6, 0.8]]
referencias:
  - clave: strang
  - clave: boyd
publicado: true
---

## Intuición

Algunos sistemas de ecuaciones son delicados. Si dos rectas se cortan en un ángulo muy cerrado, basta mover una de ellas un poco para que el punto de corte se desplace mucho a lo largo de ambas. Con datos medidos, que siempre traen algo de error, esa solución no es confiable aunque el cálculo se haga sin equivocaciones.

El número de condición mide esa fragilidad. Una matriz estira unas direcciones y encoge otras; resolver el sistema es deshacer la transformación, y deshacer un encogimiento fuerte equivale a amplificar mucho. La razón entre el mayor y el menor estiramiento dice cuánto se pueden inflar los errores relativos en el peor caso. Una rotación, que estira todo por igual, tiene condición 1, la mejor posible; una matriz casi singular tiene condición enorme.

## Definición

:::definicion[Número de condición]
Para $A$ cuadrada e invertible y una norma matricial inducida,
$$
\kappa(A) = \lVert A \rVert\,\lVert A^{-1} \rVert.
$$
Con la norma espectral, $\kappa_2(A) = \sigma_{\max}/\sigma_{\min}$. Por convención, $\kappa(A) = \infty$ si $A$ es singular.
:::

:::teorema[Sensibilidad de un sistema]
Si $A\mathbf{x} = \mathbf{b}$ y $A(\mathbf{x} + \Delta\mathbf{x}) = \mathbf{b} + \Delta\mathbf{b}$, entonces
$$
\frac{\lVert \Delta\mathbf{x} \rVert}{\lVert \mathbf{x} \rVert} \le \kappa(A)\,\frac{\lVert \Delta\mathbf{b} \rVert}{\lVert \mathbf{b} \rVert}.
$$
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz cuadrada invertible.
- $\kappa(A)$: número de condición.
- $\sigma_{\max}, \sigma_{\min}$: mayor y menor valor singular.
- $\mathbf{b}$: lado derecho; $\Delta\mathbf{b}$: su perturbación.
- $\mathbf{x}$: solución; $\Delta\mathbf{x}$: cambio que produce la perturbación.
- $\lVert \cdot \rVert$: norma vectorial y su norma matricial inducida.
:::

## Cómo usar la visualización

Un vector unitario recorre el círculo y su imagen recorre la elipse; la gráfica de la derecha muestra el estiramiento según la dirección, entre el máximo $\sigma_1$ y el mínimo $\sigma_2$. El número de condición es el cociente de ambos y aparece en el panel. El selector cambia de matriz.

En la matriz bien condicionada la curva oscila poco y el cociente es pequeño. En la mal condicionada la elipse es una aguja y el mínimo casi toca cero: el cociente pasa de 80. La matriz ortogonal da una curva plana en 1 y condición exactamente 1.

## Ejemplo

Un laboratorio resuelve $x + y = 2$ y $x + 1.05y = 2.05$, con solución $(1, 1)$. Un error de medición cambia el segundo dato a $2.1$.

1. Nuevo sistema: restando ecuaciones, $0.05y = 0.1$, así que $y = 2$ y $x = 0$.
2. Cambio relativo en los datos: $\lVert (0, 0.05) \rVert / \lVert (2, 2.05) \rVert = 0.05/2.864 \approx 0.0175$, menos del 2 %.
3. Cambio relativo en la solución: $\lVert (-1, 1) \rVert / \lVert (1, 1) \rVert = 1$, un 100 %.
4. La matriz es simétrica con valores propios $\tfrac{2.05 \pm \sqrt{4.0025}}{2} \approx 2.025$ y $0.0247$, así que $\kappa_2 \approx 82$.
5. La amplificación observada, $1/0.0175 \approx 57$, respeta la cota de 82.

:::figura[Las dos versiones del sistema del laboratorio: las rectas son casi paralelas, y mover el segundo dato de 2.05 a 2.1 lleva el punto de corte de (1, 1) a (0, 2).]{componente="VectorPlane"}
```yaml
modo: sistema
ecuaciones: [[1, 1, 2], [1, 1.05, 2.05]]
alternativas:
  - nombre: Datos originales
    ecuaciones: [[1, 1, 2], [1, 1.05, 2.05]]
  - nombre: Dato perturbado
    ecuaciones: [[1, 1, 2], [1, 1.05, 2.1]]
```
:::

:::figura[La matriz del laboratorio como estiramiento: la elipse es casi un segmento, con σ₁ ≈ 2.03 y σ₂ ≈ 0.025.]{componente="MatrixTransform"}
```yaml
modo: estiramiento
matrices:
  - nombre: Laboratorio
    matriz: [[1, 1], [1, 1.05]]
```
:::

## Propiedades

- **Cota inferior:** $\kappa(A) \ge 1$, con igualdad para múltiplos de matrices ortogonales en la norma espectral.
- **Escala:** $\kappa(cA) = \kappa(A)$; multiplicar todo por un número no mejora ni empeora el condicionamiento.
- **Pérdida de dígitos:** en aritmética de punto flotante se pierden aproximadamente $\log_{10}\kappa(A)$ dígitos correctos al resolver el sistema.
- **Ecuaciones normales:** $\kappa(A^\top A) = \kappa(A)^2$, por eso resolver mínimos cuadrados con QR es preferible.
- **Distancia a la singularidad:** $1/\kappa_2(A)$ es la distancia relativa, en norma espectral, de $A$ a la matriz singular más cercana.
- **El determinante no mide el condicionamiento:** una matriz puede tener determinante diminuto y condición 1.

:::demostracion
Cota: $A\Delta\mathbf{x} = \Delta\mathbf{b}$ da $\lVert \Delta\mathbf{x} \rVert \le \lVert A^{-1} \rVert\,\lVert \Delta\mathbf{b} \rVert$, y $\mathbf{b} = A\mathbf{x}$ da $\lVert \mathbf{b} \rVert \le \lVert A \rVert\,\lVert \mathbf{x} \rVert$. Dividiendo, $\dfrac{\lVert \Delta\mathbf{x} \rVert}{\lVert \mathbf{x} \rVert} \le \lVert A \rVert\,\lVert A^{-1} \rVert\,\dfrac{\lVert \Delta\mathbf{b} \rVert}{\lVert \mathbf{b} \rVert}$.
:::

## Errores comunes

- **Usar el determinante como medida de cercanía a la singularidad.** $\det(0.1\,I_{10}) = 10^{-10}$ y la matriz tiene condición 1.
- **Pensar que un buen algoritmo arregla un problema mal condicionado.** El algoritmo puede ser estable y la respuesta seguir siendo sensible a los datos.
- **Confundir condición con error.** La condición es una cota del peor caso; un error concreto puede amplificarse mucho menos.
- **Ignorar las unidades.** Cambiar la escala de una sola variable sí puede cambiar mucho el número de condición.

## Conexiones

El número de condición combina las [[normas-matriciales]] de $A$ y de su inversa, y se lee de la [[descomposicion-en-valores-singulares]]. Describe la sensibilidad de los [[sistemas-de-ecuaciones-lineales]] y explica por qué se prefiere la [[descomposicion-qr]] para mínimos cuadrados. En regresión, una matriz de diseño mal condicionada es el síntoma numérico de la multicolinealidad.

## Formulario

:::formula[Número de condición]
$$
\kappa(A) = \lVert A \rVert\,\lVert A^{-1} \rVert, \qquad \kappa_2(A) = \frac{\sigma_{\max}}{\sigma_{\min}}
$$

- $\sigma_{\max}, \sigma_{\min}$: valores singulares extremos.
:::

:::formula[Amplificación de errores]
$$
\frac{\lVert \Delta\mathbf{x} \rVert}{\lVert \mathbf{x} \rVert} \le \kappa(A)\,\frac{\lVert \Delta\mathbf{b} \rVert}{\lVert \mathbf{b} \rVert}
$$

- $\Delta\mathbf{b}$: error en los datos.
- $\Delta\mathbf{x}$: error resultante en la solución.
:::

:::formula[Ecuaciones normales]
$$
\kappa_2(A^\top A) = \kappa_2(A)^2
$$

- $A^\top A$: matriz de las ecuaciones normales.
:::

:::formula[Dígitos perdidos]
$$
\text{dígitos perdidos} \approx \log_{10}\kappa(A)
$$

- $\log_{10}$: logaritmo base 10.
:::
