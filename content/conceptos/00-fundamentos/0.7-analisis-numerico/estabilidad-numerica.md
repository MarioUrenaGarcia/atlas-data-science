---
id: estabilidad-numerica
titulo: Estabilidad numérica
titulo_en: Numerical stability
alias:
  - algoritmo estable
  - cancelación catastrófica
  - propagación del error
modulo: 0
submodulo: '0.7'
orden: 3
nivel: intermedio
prerrequisitos:
  - error-de-redondeo-y-error-de-truncamiento
relaciones:
  - tipo: relacionado
    id: numero-de-condicion
etiquetas:
  - estabilidad
  - propagación de errores
  - cancelación
  - algoritmos
resumen: >
  Un algoritmo es estable si no amplifica más de lo inevitable los errores de redondeo. Dos fórmulas
  equivalentes en álgebra exacta pueden dar resultados muy distintos en punto flotante.
formula: 'I_n = 1 - n\,I_{n-1}: \quad |\text{error}_n| = n!\,|\text{error}_0|'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: estabilidad
    caso: recurrencia
referencias:
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Un rumor que pasa de boca en boca puede deformarse de dos maneras. Si cada persona lo cuenta casi igual, las pequeñas alteraciones se quedan pequeñas. Si cada persona exagera lo que oyó, una diferencia mínima al principio termina en una historia irreconocible. Los algoritmos numéricos se comportan igual con los errores de redondeo: todos los cometen, pero unos los mantienen del tamaño del épsilon de máquina y otros los multiplican paso a paso.

Que un algoritmo sea estable no depende de que su fórmula sea correcta en papel: dos fórmulas equivalentes en álgebra exacta pueden ser una estable y otra no. Calcular una varianza como el promedio de los cuadrados menos el cuadrado del promedio es correcto, pero si los datos son números grandes y parecidos, la resta de dos cantidades enormes casi iguales borra todas las cifras útiles. Reordenar el cálculo para no restar cantidades grandes resuelve el problema sin cambiar el resultado exacto.

## Definición

Se distinguen dos propiedades distintas:

:::definicion[Condicionamiento y estabilidad]
- Un **problema** está **bien condicionado** si pequeños cambios relativos en los datos producen pequeños cambios relativos en la solución exacta; el número de condición mide el factor de amplificación.
- Un **algoritmo** es **estable** (hacia atrás) si el resultado que calcula es la solución exacta de un problema con datos ligeramente perturbados, con perturbaciones del orden de $\varepsilon$.
:::

Si el algoritmo es estable, el error del resultado es a lo más del orden del número de condición por $\varepsilon$. Si es inestable, el error puede ser mucho mayor aunque el problema esté bien condicionado.

Un ejemplo es la recurrencia para $I_n = \int_0^1 x^n e^{x - 1}\,dx$, que cumple $I_n = 1 - n I_{n-1}$ con $I_0 = 1 - e^{-1}$. Si $I_0$ tiene un error $\delta$, hacia adelante el error se multiplica por $-n$ en cada paso y llega a $n!\,\delta$. Despejando hacia atrás, $I_{n-1} = (1 - I_n)/n$, el error se divide entre $n$ en cada paso.

:::nota[Qué significa cada símbolo]
- $I_n$: integral de $x^n e^{x-1}$ entre 0 y 1; $n$: índice de la recurrencia.
- $\delta$: error inicial, del tamaño del épsilon de máquina.
- $n!$: factorial de $n$, factor de amplificación de la recurrencia hacia adelante.
- $\varepsilon$: épsilon de máquina.
:::

## Cómo usar la visualización

La vista recorre la recurrencia de $I_0$ a $I_{20}$. A la izquierda, los valores calculados hacia atrás, en azul, y hacia adelante, en rosa; a la derecha, el logaritmo del error de la dirección hacia adelante. El encabezado escribe cada paso de las dos direcciones con sus números.

Hasta $n = 10$ las dos columnas coinciden en nueve cifras; el error hacia adelante sube como $n!$ y en $n = 18$ el valor ya es negativo, imposible para una integral de una función positiva. La recta de la derecha se curva hacia arriba porque $\log n!$ crece más rápido que linealmente.

## Ejemplo

Se calcula $I_{20}$ con la recurrencia en las dos direcciones.

1. $I_0 = 1 - e^{-1} = 0.6321205588\ldots$, guardado con un error relativo menor que $10^{-16}$.
2. Hacia adelante: $I_1 = 1 - I_0 = 0.36788$, $I_2 = 1 - 2I_1 = 0.26424$, \ldots; en $n = 10$ da $0.0838770700583$ y el valor correcto es $0.0838770701034$.
3. En $n = 15$ el error ya es $1.6 \times 10^{-5}$; en $n = 18$ el resultado es $-0.0295$ y en $n = 20$, $-30.19$.
4. Hacia atrás se empieza con $I_{25} = 0$, aunque el valor exacto es cercano a $0.037$: el error inicial de $0.037$ se divide entre $25 \cdot 24 \cdots 21$ antes de llegar a $I_{20}$, que sale $0.0455449$ con sus siete cifras correctas: el error que queda es de unos $6 \times 10^{-9}$.
5. La fórmula es la misma; solo cambia la dirección en que se recorre.

:::figura[La otra forma de la inestabilidad: la varianza de 4, 7, 13 y 16 desplazados por $10^8$. La fórmula de un paso da 29.33 en lugar de 30 porque resta dos números cercanos a $4 \times 10^{16}$; Welford da 30.]{componente="NumericsLab"}
```yaml
modo: estabilidad
caso: varianza
desplazamiento: 8
```
:::

## Propiedades

- **Condicionamiento y estabilidad son independientes:** un problema mal condicionado da resultados sensibles con cualquier algoritmo; uno bien condicionado puede arruinarse con un algoritmo inestable.

:::figura[Un problema mal condicionado: la matriz $\begin{pmatrix} 1 & 1 \\ 1 & 1.01 \end{pmatrix}$ estira unas direcciones cientos de veces más que otras, así que resolver un sistema con ella pierde cifras con cualquier algoritmo, por estable que sea.]{componente="MatrixTransform"}
```yaml
modo: estiramiento
matrices:
  - nombre: Casi singular
    matriz: [[1, 1], [1, 1.01]]
```
:::

- **Cancelación catastrófica:** restar dos números con muchas cifras en común deja solo las últimas, que son las afectadas por el redondeo.
- **Reformular evita restas:** $\sqrt{x + 1} - \sqrt{x} = \dfrac{1}{\sqrt{x + 1} + \sqrt{x}}$ y $1 - \cos x = 2\operatorname{sen}^2(x/2)$ son equivalentes y estables para $x$ grande o pequeño, respectivamente.
- **Recurrencias:** una recurrencia que multiplica el error por $|\lambda| > 1$ en cada paso es inestable en esa dirección y estable en la contraria.
- **Algoritmos estables conocidos:** la eliminación con pivoteo parcial, la factorización QR con Householder y el algoritmo de Welford para la varianza.

## Errores comunes

- **Pensar que una fórmula correcta siempre funciona.** Con datos desplazados por $10^9$ la fórmula de un paso da una varianza negativa, $-170.67$, para cuatro números cuya varianza es 30.

:::figura[Con desplazamiento $10^9$ la fórmula de un paso da $-170.67$ y con $10^{10}$ da $21845$: el resultado ya no tiene relación con la varianza 30, mientras Welford la conserva exacta en todos los desplazamientos.]{componente="NumericsLab"}
```yaml
modo: estabilidad
caso: varianza
desplazamiento: 9
```
:::

- **Culpar al problema de un algoritmo malo.** Calcular la varianza de 4, 7, 13 y 16 desplazados por $10^9$ es un problema perfectamente condicionado.
- **Creer que más precisión elimina la inestabilidad.** Solo la retrasa: en la recurrencia el error crece como $n!$ y alcanza a cualquier precisión fija.
- **Confundir estabilidad numérica con estabilidad de un sistema dinámico.** Son ideas relacionadas pero distintas: la primera habla de errores de redondeo en un algoritmo.

## Conexiones

Estudia cómo se propaga el [[error-de-redondeo-y-error-de-truncamiento]] dentro de un algoritmo. El [[numero-de-condicion]] mide la sensibilidad del problema, y el [[truco-log-sum-exp]] es un ejemplo de reformulación estable. En la [[eliminacion-gaussiana]] el pivoteo parcial es la medida de estabilidad, y en los [[metodos-numericos-para-ecuaciones-diferenciales]] el paso debe cumplir condiciones de estabilidad.

## Formulario

:::formula[Recurrencia de las integrales]
$$
I_n = \int_0^1 x^n e^{x - 1}\,dx = 1 - n\,I_{n-1}, \qquad I_0 = 1 - e^{-1}
$$

- $I_n$: integral de índice $n$.
:::

:::formula[Propagación del error hacia adelante y hacia atrás]
$$
\text{error}_n = (-1)^n\, n!\,\delta, \qquad \text{error}_{n-1} = -\frac{\text{error}_n}{n}
$$

- $\delta$: error en $I_0$; $n!$: factor de amplificación.
:::

:::formula[Cota con un algoritmo estable]
$$
\frac{|\tilde{y} - y|}{|y|} \lesssim \kappa\,\varepsilon
$$

- $\tilde{y}$: resultado calculado; $y$: exacto; $\kappa$: número de condición; $\varepsilon$: épsilon de máquina.
:::

:::formula[Varianza: fórmula de un paso y actualización de Welford]
$$
s^2 = \frac{\sum x_i^2 - n\bar{x}^2}{n - 1}, \qquad \bar{x}_k = \bar{x}_{k-1} + \frac{x_k - \bar{x}_{k-1}}{k}, \quad M_k = M_{k-1} + (x_k - \bar{x}_{k-1})(x_k - \bar{x}_k)
$$

- $\bar{x}_k$: media de los primeros $k$ datos; $M_k$: suma de cuadrados de desviaciones; $s^2 = M_n/(n - 1)$.
:::
