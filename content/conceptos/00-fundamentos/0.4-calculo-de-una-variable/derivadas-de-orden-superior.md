---
id: derivadas-de-orden-superior
titulo: Derivadas de orden superior
titulo_en: Higher-order derivatives
alias:
  - segunda derivada
  - aceleración
  - curvatura
  - concavidad
modulo: 0
submodulo: '0.4'
orden: 7
nivel: basico
prerrequisitos:
  - reglas-de-derivacion
etiquetas:
  - segunda derivada
  - concavidad
  - aceleración
  - puntos de inflexión
resumen: >
  Derivar la derivada da la segunda derivada, que mide cómo cambia la pendiente: su signo indica si la
  gráfica se curva hacia arriba o hacia abajo; en física es la aceleración.
formula: 'f''''(x) = \frac{d}{dx}f''(x) = \frac{d^2 f}{dx^2}, \qquad f^{(n)} = \big(f^{(n-1)}\big)'''
visualizacion:
  componente: CalculusViz
  parametros:
    modo: derivadas
    funciones: [cuartica, seno, x-exp, sigmoide]
    orden: 2
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

La velocidad es la derivada de la posición, y la aceleración es la derivada de la velocidad: dice si el velocímetro sube o baja. De la misma forma, en cualquier función la segunda derivada mide cómo cambia la pendiente. Si la pendiente va en aumento, la curva se dobla hacia arriba como un tazón; si va en disminución, se dobla hacia abajo como un domo.

Esa información no se ve en la primera derivada sola. Dos curvas pueden subir con la misma pendiente en un punto, pero una se está acelerando y la otra frenando. La segunda derivada distingue ambos casos, decide si un punto plano es un mínimo o un máximo, y localiza los puntos de inflexión donde la curva cambia de doblarse hacia un lado a doblarse hacia el otro. Las derivadas de orden aún mayor refinan la descripción y alimentan las aproximaciones de Taylor.

## Definición

:::definicion[Derivadas sucesivas]
Si $f'$ es derivable, su derivada es la **segunda derivada**,
$$
f''(x) = \frac{d}{dx}\,f'(x) = \frac{d^2 f}{dx^2}.
$$
En general $f^{(0)} = f$ y $f^{(n)} = \big(f^{(n-1)}\big)'$ es la **derivada de orden $n$**.
:::

:::definicion[Concavidad e inflexión]
$f$ es **cóncava hacia arriba** en un intervalo si $f'' > 0$ en él y **cóncava hacia abajo** si $f'' < 0$. Un **punto de inflexión** es un punto de la gráfica donde la concavidad cambia; en él, si $f''$ es continua, $f'' = 0$.
:::

:::nota[Qué significa cada símbolo]
- $f$: función estudiada.
- $f'$: primera derivada, la pendiente.
- $f''$: segunda derivada, el ritmo de cambio de la pendiente.
- $f^{(n)}$: derivada de orden $n$.
- $\frac{d^2 f}{dx^2}$: notación de Leibniz para la segunda derivada.
- $n$: orden de la derivada.
:::

## Cómo usar la visualización

Tres paneles comparten el eje $x$: la función con su tangente, la primera derivada y la segunda. Un punto recorre las tres gráficas a la vez; el selector cambia de función. El panel y la fórmula informan en el punto actual si la función crece o decrece y si es cóncava hacia arriba o hacia abajo.

Donde la gráfica de $f''$ está sobre el eje, la tangente de arriba gira en sentido contrario a las manecillas del reloj mientras avanza. Donde $f''$ cruza el cero, la curva de arriba cambia de tazón a domo. Con el seno, cada derivada es la anterior desplazada un cuarto de periodo.

## Ejemplo

Un tren se mueve según $s(t) = t^3 - 3t$ (kilómetros, minutos).

1. Velocidad: $v(t) = s'(t) = 3t^2 - 3$.
2. Aceleración: $a(t) = s''(t) = 6t$.
3. En $t = -1$: $v = 0$ y $a = -6$; el tren se detiene mientras frena, así que $s$ tiene un máximo local.
4. En $t = 0$: $a = 0$ y cambia de signo: es un punto de inflexión de $s$, donde el tren pasa de frenar a acelerar.
5. Tercera derivada: $s'''(t) = 6$, constante; la aceleración crece al mismo ritmo todo el tiempo.

:::figura[El recorrido del tren del ejemplo con su velocidad y su aceleración: la aceleración 6t cambia de signo en t = 0, justo donde la curva de arriba cambia de concavidad.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [cubica]
orden: 2
```
:::

## Propiedades

- **Criterio de la segunda derivada:** si $f'(c) = 0$ y $f''(c) > 0$, $c$ es un mínimo local; si $f''(c) < 0$, un máximo local.
- **Polinomios:** la derivada de orden $n + 1$ de un polinomio de grado $n$ es cero.
- **Exponencial y seno:** $(e^x)^{(n)} = e^x$ y $(\operatorname{sen} x)^{(n)} = \operatorname{sen}(x + n\pi/2)$.
- **Fórmula de Leibniz:** $(fg)^{(n)} = \sum_{k=0}^{n}\binom{n}{k} f^{(k)}g^{(n-k)}$.
- **Convexidad:** $f'' \ge 0$ en un intervalo equivale a que $f$ sea convexa en él.
- **Aproximación cuadrática:** $f(a + h) \approx f(a) + f'(a)h + \tfrac{1}{2}f''(a)h^2$.

:::figura[Caso de la curva de Gauss e^(-x²): es cóncava hacia abajo cerca de 0 y hacia arriba en las colas, con puntos de inflexión en ±1/raíz de 2, marcados con rombos.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [gauss]
orden: 2
criticos: true
```
:::

:::demostracion
Aproximación cuadrática: sea $p(h) = f(a) + f'(a)h + \tfrac{1}{2}f''(a)h^2$. Entonces $p(0) = f(a)$, $p'(0) = f'(a)$ y $p''(0) = f''(a)$: es el único polinomio de grado 2 que coincide con $f$ en valor, pendiente y curvatura en $a$, y su error es de orden $h^3$ si $f'''$ es acotada.
:::

## Errores comunes

- **Creer que $f'' = 0$ implica inflexión.** $x^4$ tiene $f''(0) = 0$ y no cambia de concavidad.
- **Confundir cóncava hacia abajo con decreciente.** $\sqrt{x}$ crece y es cóncava hacia abajo.
- **Usar el criterio de la segunda derivada cuando es cero.** Si $f''(c) = 0$ el criterio no decide; hay que estudiar el signo de $f'$ alrededor.
- **Escribir $f^2$ por $f''$.** $f^{(2)}$ es la segunda derivada; $f^2$ es el cuadrado de la función.

## Conexiones

Las derivadas de orden superior se obtienen repitiendo las [[reglas-de-derivacion]]. La segunda decide los [[maximos-y-minimos]] y caracteriza las [[funciones-convexas-y-concavas]]; todas juntas forman los coeficientes de la [[serie-de-taylor-y-de-maclaurin]]. En optimización, el método de Newton usa la segunda derivada para dar pasos mejor escalados que el descenso de gradiente.

## Formulario

:::formula[Segunda derivada]
$$
f''(x) = \frac{d}{dx}\,f'(x) = \frac{d^2 f}{dx^2}
$$

- $f'$: primera derivada.
:::

:::formula[Derivada de orden n]
$$
f^{(n)} = \big(f^{(n-1)}\big)', \qquad f^{(0)} = f
$$

- $n$: orden.
:::

:::formula[Criterio de la segunda derivada]
$$
f'(c) = 0,\ f''(c) > 0 \Rightarrow \text{mínimo local}; \qquad f'(c) = 0,\ f''(c) < 0 \Rightarrow \text{máximo local}
$$

- $c$: punto crítico.
:::

:::formula[Regla de Leibniz]
$$
(fg)^{(n)} = \sum_{k=0}^{n} \binom{n}{k} f^{(k)}\,g^{(n-k)}
$$

- $\binom{n}{k}$: coeficiente binomial.
:::
