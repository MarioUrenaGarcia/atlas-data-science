---
id: metodo-de-biseccion
titulo: Método de bisección
titulo_en: Bisection method
alias:
  - bisección
  - búsqueda binaria de raíces
modulo: 0
submodulo: '0.7'
orden: 5
nivel: intermedio
prerrequisitos:
  - continuidad
etiquetas:
  - raíces
  - valor intermedio
  - convergencia lineal
  - algoritmos
resumen: >
  La bisección encuentra una raíz de una función continua partiendo a la mitad, una y otra vez, un intervalo
  donde la función cambia de signo; el intervalo se reduce a la mitad en cada paso.
formula: 'm = \frac{a + b}{2}, \qquad [a, b] \leftarrow \begin{cases} [a, m] & f(a)\,f(m) \le 0 \\ [m, b] & \text{si no} \end{cases}'
visualizacion:
  componente: AlgorithmStepper
  parametros:
    algoritmo: biseccion
    valores:
      funcion: cubica
      a: 1
      b: 2
      tolerancia: -6
referencias:
  - clave: boyd
publicado: true
---

## Intuición

Para adivinar un número entre 1 y 100 con preguntas de "mayor o menor", la mejor estrategia es preguntar siempre por la mitad del intervalo que queda: cada respuesta descarta la mitad de las posibilidades y en siete preguntas se encuentra el número. La bisección hace lo mismo para encontrar dónde una función continua vale cero.

Si una función continua es negativa en un extremo de un intervalo y positiva en el otro, por el teorema del valor intermedio tiene que cruzar el cero en algún punto de en medio. Se evalúa la función en el punto medio y se mira su signo: el cruce está en la mitad donde el signo cambia. Esa mitad es el nuevo intervalo. El método es lento comparado con otros, porque solo usa el signo de la función, pero nunca falla: si al empezar hay cambio de signo, al final hay una raíz dentro de un intervalo tan pequeño como se quiera.

## Definición

:::definicion[Método de bisección]
Sea $f$ continua en $[a_0, b_0]$ con $f(a_0)\,f(b_0) < 0$. Para $k = 0, 1, 2, \dots$:

1. $m_k = \dfrac{a_k + b_k}{2}$.
2. Si $f(a_k)\,f(m_k) \le 0$, entonces $[a_{k+1}, b_{k+1}] = [a_k, m_k]$; si no, $[a_{k+1}, b_{k+1}] = [m_k, b_k]$.
3. Se detiene cuando $(b_k - a_k)/2 \le \text{tol}$ y se reporta el punto medio.
:::

Cada intervalo contiene una raíz $r$ y mide $(b_0 - a_0)/2^k$, así que $|m_k - r| \le (b_0 - a_0)/2^{k+1}$. Alcanzar una tolerancia requiere
$$
k \ge \log_2 \frac{b_0 - a_0}{2\,\text{tol}}
$$
iteraciones, sin importar la función.

:::nota[Qué significa cada símbolo]
- $f$: función continua cuya raíz se busca.
- $[a_k, b_k]$: intervalo en el paso $k$; $a_0$, $b_0$: extremos iniciales.
- $m_k$: punto medio del paso $k$.
- $r$: raíz dentro del intervalo.
- $\text{tol}$: tolerancia, el error máximo aceptado.
- $k$: número de iteraciones.
:::

## Cómo usar la visualización

A la izquierda, el pseudocódigo con la línea actual resaltada y el valor de cada variable; a la derecha, la gráfica de la función con el intervalo actual sombreado, los intervalos anteriores como franjas y el punto medio. Cada paso evalúa $f(m)$ y conserva la mitad con cambio de signo. Los controles cambian la función, los extremos iniciales y la tolerancia.

Con $x^3 - x - 2$ en $[1, 2]$ el intervalo se reduce a la mitad en cada paso y el método se detiene tras 19 iteraciones con tolerancia $10^{-6}$. Si se eligen extremos donde la función tiene el mismo signo, el método no arranca.

## Ejemplo

Se busca la raíz de $f(x) = x^3 - x - 2$ en $[1, 2]$, donde $f(1) = -2$ y $f(2) = 4$.

1. $m_0 = 1.5$, $f(1.5) = -0.125 < 0$: la raíz está en $[1.5, 2]$.
2. $m_1 = 1.75$, $f(1.75) = 1.609 > 0$: queda $[1.5, 1.75]$.
3. $m_2 = 1.625$, $f(1.625) = 0.666 > 0$: queda $[1.5, 1.625]$.
4. $m_3 = 1.5625$, $f(1.5625) = 0.252 > 0$: queda $[1.5, 1.5625]$, de ancho $0.0625 = 1/2^4$.
5. Para una tolerancia de $10^{-6}$ se necesitan $\log_2(1/(2 \cdot 10^{-6})) = 18.9$, es decir, 19 iteraciones; la raíz es $1.5213797\ldots$

:::figura[La bisección de $\cos x - x$ en $[0, 1]$: los puntos medios 0.5, 0.75 y 0.625 tienen $f$ igual a 0.378, $-0.018$ y 0.186, y el intervalo se acerca a la raíz 0.7390851.]{componente="AlgorithmStepper"}
```yaml
algoritmo: biseccion
valores:
  funcion: coseno
  a: 0
  b: 1
  tolerancia: -6
```
:::

## Propiedades

- **Convergencia garantizada:** con $f$ continua y cambio de signo, el método siempre converge a una raíz.
- **Convergencia lineal de razón 1/2:** cada paso gana un bit de precisión; diez pasos reducen el error unas mil veces.

:::figura[$e^x - 3$ en $[0, 2]$ con tolerancia $10^{-10}$: se necesitan 34 iteraciones, el número que da $\log_2(2/(2 \cdot 10^{-10}))$, sin importar la forma de la función.]{componente="AlgorithmStepper"}
```yaml
algoritmo: biseccion
valores:
  funcion: exponencial
  a: 0
  b: 2
  tolerancia: -10
```
:::

- **Número de pasos conocido de antemano:** depende solo del ancho inicial y la tolerancia.
- **Varias raíces:** si hay varias en el intervalo, encuentra alguna, sin control sobre cuál.
- **Uso combinado:** los métodos híbridos, como el de Brent, usan la bisección como respaldo seguro de métodos más rápidos.

## Errores comunes

- **Empezar sin cambio de signo.** Si $f(a)$ y $f(b)$ tienen el mismo signo, puede haber cero, dos o más raíces y el método no tiene en qué apoyarse.

:::figura[$x^3 - x - 2$ en $[2, 3]$: $f(2) = 4$ y $f(3) = 22$ son positivos, así que el método no puede empezar, aunque la función sí tiene una raíz fuera del intervalo, en 1.52.]{componente="AlgorithmStepper"}
```yaml
algoritmo: biseccion
valores:
  funcion: cubica
  a: 2
  b: 3
  tolerancia: -6
```
:::

- **Aplicarlo a funciones discontinuas.** $1/x$ cambia de signo en $[-1, 1]$ y no tiene raíz: la bisección converge al polo en 0.
- **Confundir tolerancia en $x$ con tolerancia en $f$.** Un intervalo pequeño no garantiza $|f(m)|$ pequeño si la función es muy empinada, y al revés.
- **Esperar rapidez.** Para 15 cifras correctas necesita unas 50 iteraciones, mientras que Newton-Raphson suele necesitar cinco o seis.

## Conexiones

Se basa en el teorema del valor intermedio de la [[continuidad]]. El [[metodo-de-newton-raphson]] converge mucho más rápido pero sin garantía, y la búsqueda de raíces de la derivada es una forma de resolver el [[problema-de-optimizacion]]. La idea de partir a la mitad aparece también en la [[busqueda-lineal]] por retroceso.

## Formulario

:::formula[Paso de bisección]
$$
m_k = \frac{a_k + b_k}{2}, \qquad [a_{k+1}, b_{k+1}] = \begin{cases} [a_k, m_k] & f(a_k) f(m_k) \le 0 \\ [m_k, b_k] & \text{si no} \end{cases}
$$

- $m_k$: punto medio; $[a_k, b_k]$: intervalo con cambio de signo.
:::

:::formula[Cota del error]
$$
|m_k - r| \le \frac{b_0 - a_0}{2^{k+1}}
$$

- $r$: raíz; $b_0 - a_0$: ancho inicial; $k$: iteración.
:::

:::formula[Iteraciones necesarias]
$$
k \ge \log_2 \frac{b_0 - a_0}{2\,\text{tol}}
$$

- $\text{tol}$: tolerancia deseada.
:::
