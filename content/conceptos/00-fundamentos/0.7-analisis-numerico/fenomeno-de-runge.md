---
id: fenomeno-de-runge
titulo: Fenómeno de Runge
titulo_en: Runge's phenomenon
alias:
  - oscilaciones de Runge
  - función de Runge
  - nodos de Chebyshev
modulo: 0
submodulo: '0.7'
orden: 8
nivel: intermedio
prerrequisitos:
  - interpolacion-polinomial
etiquetas:
  - interpolación
  - oscilaciones
  - nodos de Chebyshev
  - convergencia
resumen: >
  Al interpolar 1/(1 + 25x²) con nodos igualmente espaciados, el polinomio oscila cada vez más cerca de los
  extremos y el error crece con el grado; con nodos de Chebyshev el error baja.
formula: 'f(x) = \frac{1}{1 + 25x^2}, \qquad \max_{[-1, 1]} |f - p_{n-1}| \to \infty \ \text{con nodos equiespaciados}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: interpolacion
    funcion: runge
    nodos: equiespaciados
    n: 9
referencias:
  - clave: hastie-esl
publicado: true
---

## Intuición

Uno esperaría que, entre más puntos de una función suave se conozcan, mejor la siga el polinomio que pasa por todos ellos. Carl Runge encontró en 1901 una función perfectamente suave, en forma de campana angosta, para la que pasa lo contrario: con puntos igualmente espaciados en $[-1, 1]$ el polinomio coincide con la campana en el centro, pero cerca de los extremos oscila con amplitud cada vez mayor al agregar puntos.

El origen está en cómo se reparte el error. El error de interpolación es un factor que depende de la función por el producto de las distancias de $x$ a todos los nodos, y con nodos igualmente espaciados ese producto es enorme cerca de los bordes. Si se colocan más nodos cerca de los extremos, como hacen los nodos de Chebyshev, el producto se reparte de manera pareja y el error baja al aumentar el grado. El fenómeno enseña que el problema no es la función ni el grado alto en sí, sino la elección de los nodos.

## Definición

:::definicion[Fenómeno de Runge]
Para $f(x) = \dfrac{1}{1 + 25x^2}$ en $[-1, 1]$ y $p_{n-1}$ el polinomio que la interpola en $n$ nodos igualmente espaciados,
$$
\lim_{n \to \infty} \max_{x \in [-1, 1]} |f(x) - p_{n-1}(x)| = \infty,
$$
aunque $f$ tiene derivadas de todos los órdenes. Las oscilaciones aparecen cerca de $x = \pm 1$.
:::

Los **nodos de Chebyshev** en $[-1, 1]$ son $x_i = \cos\dfrac{(2i - 1)\pi}{2n}$, $i = 1, \dots, n$. Con ellos el producto de la fórmula del error cumple $\max_x \prod_{i=1}^{n}|x - x_i| = 2^{1 - n}$, el menor posible, y para la función de Runge el interpolante converge.

:::nota[Qué significa cada símbolo]
- $f$: función de Runge, una campana de ancho cercano a $1/5$.
- $p_{n-1}$: polinomio interpolante de grado $n - 1$.
- $n$: número de nodos.
- $x_i$: nodos de Chebyshev, proyecciones de puntos igualmente espaciados en una semicircunferencia.
:::

## Cómo usar la visualización

La curva azul es la función de Runge y la naranja el polinomio por los nodos marcados. La reproducción agrega un nodo por cuadro hasta 20 y el encabezado escribe el grado y el error máximo. El control cambia entre nodos igualmente espaciados y de Chebyshev.

Con nodos igualmente espaciados, a partir de unos 9 nodos el polinomio forma picos cerca de los extremos y el error pasa de 1 a más de 14 con 17 nodos. Al cambiar a nodos de Chebyshev con la misma reproducción, los picos desaparecen y el error baja hasta 0.03.

## Ejemplo

Se compara el error máximo en $[-1, 1]$ para la función de Runge con los dos tipos de nodos.

1. Con 5 nodos: 0.438 igualmente espaciados y 0.402 de Chebyshev; casi iguales.
2. Con 9 nodos: 1.045 y 0.171. El error con nodos igualmente espaciados ya supera la altura máxima de la función, que es 1.
3. Con 13 nodos: 3.66 y 0.069.
4. Con 17 nodos: 14.39 y 0.033. Cada cuatro nodos más, el error igualmente espaciado se multiplica por cerca de 4 y el de Chebyshev se reduce a la mitad.
5. La diferencia es solo la ubicación de los nodos: la función y el grado son los mismos.

:::figura[La función de Runge con 9 nodos de Chebyshev, más juntos cerca de los extremos: el polinomio de grado 8 sigue la campana sin picos, con error máximo 0.171 en lugar de 1.045.]{componente="NumericsLab"}
```yaml
modo: interpolacion
funcion: runge
nodos: chebyshev
n: 9
```
:::

## Propiedades

- **Nodos de Chebyshev:** para funciones suaves en un intervalo, el interpolante en nodos de Chebyshev converge, y lo hace muy rápido si la función es analítica.

:::figura[Con 17 nodos de Chebyshev el error baja a 0.033 y sigue bajando al agregar nodos: la reproducción, que llega a 20, muestra el polinomio cada vez más pegado a la campana.]{componente="NumericsLab"}
```yaml
modo: interpolacion
funcion: runge
nodos: chebyshev
n: 17
```
:::

- **Constante de Lebesgue:** mide cuánto puede amplificar la interpolación los errores de los datos; crece como $2^n$ con nodos igualmente espaciados y solo como $\log n$ con los de Chebyshev.
- **Singularidades complejas:** la función de Runge tiene polos en $x = \pm i/5$; los polos cercanos al intervalo son los que causan la divergencia.
- **Alternativas:** si los nodos están fijos e igualmente espaciados, conviene usar polinomios por tramos, como los splines, o un ajuste por mínimos cuadrados de grado bajo.

## Errores comunes

- **Subir el grado para arreglar las oscilaciones.** Con nodos igualmente espaciados el error pasa de 3.66 con 13 nodos a 14.39 con 17: subir el grado empeora.

:::figura[13 nodos igualmente espaciados: el polinomio de grado 12 sigue bien el centro, pero entre los dos últimos nodos de cada lado baja hasta $-3.62$, en $x = \pm 0.95$, aunque la función es positiva en todo el intervalo.]{componente="NumericsLab"}
```yaml
modo: interpolacion
funcion: runge
nodos: equiespaciados
n: 13
```
:::

- **Culpar a la falta de suavidad.** La función de Runge tiene derivadas de todos los órdenes; el problema son los nodos.
- **Pensar que el error es de redondeo.** Las oscilaciones aparecen igual en aritmética exacta; son error de interpolación.
- **Generalizar a cualquier función.** Con $\operatorname{sen} x$ y nodos igualmente espaciados el error baja sin problema; el fenómeno depende de la función y del intervalo.

## Conexiones

Es la principal limitación de la [[interpolacion-polinomial]] con nodos igualmente espaciados. Los [[splines-cubicos]] lo evitan usando polinomios de grado 3 por tramos, y la [[cuadratura-gaussiana]] usa nodos que, como los de Chebyshev, se concentran cerca de los extremos. Es un ejemplo de cómo un modelo con más parámetros puede sobreajustar los datos que interpola.

## Formulario

:::formula[Función de Runge]
$$
f(x) = \frac{1}{1 + 25x^2}, \qquad x \in [-1, 1]
$$

- $x$: variable; la campana tiene altura 1 en $x = 0$.
:::

:::formula[Nodos de Chebyshev]
$$
x_i = \cos\frac{(2i - 1)\pi}{2n}, \qquad i = 1, \dots, n
$$

- $n$: número de nodos; en un intervalo $[a, b]$ se usan $\tfrac{a + b}{2} + \tfrac{b - a}{2}x_i$.
:::

:::formula[Producto de nodos de Chebyshev]
$$
\max_{x \in [-1, 1]} \prod_{i=1}^{n} |x - x_i| = 2^{1 - n}
$$

- Es el menor valor posible entre todas las elecciones de $n$ nodos.
:::

:::formula[Error de interpolación]
$$
f(x) - p_{n-1}(x) = \frac{f^{(n)}(\xi)}{n!}\prod_{i=1}^{n}(x - x_i)
$$

- $p_{n-1}$: interpolante; $\xi$: punto intermedio.
:::
