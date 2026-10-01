---
id: continuidad
titulo: Continuidad
titulo_en: Continuity
alias:
  - función continua
  - discontinuidad
  - discontinuidad evitable
  - teorema del valor intermedio
modulo: 0
submodulo: '0.4'
orden: 3
nivel: basico
prerrequisitos:
  - limites
  - funciones-reales-y-sus-graficas
etiquetas:
  - continuidad
  - discontinuidades
  - valor intermedio
  - límites
resumen: >
  Una función es continua en a si está definida en a, tiene límite en a y ese límite es f(a); las
  discontinuidades pueden ser evitables, de salto, infinitas u oscilantes.
formula: 'f \text{ continua en } a \iff \lim_{x \to a} f(x) = f(a)'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: limite
    casos: [continua, removible, salto, infinito, oscilante]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una función continua se puede dibujar sin levantar el lápiz: pequeños cambios en la entrada producen pequeños cambios en la salida. La temperatura de una habitación a lo largo del día es continua; la tarifa de un estacionamiento que cobra por hora completa no lo es, porque salta de golpe al cumplirse cada hora.

Las formas de romper la continuidad se pueden clasificar. Un hueco aislado, como un punto que falta o que está fuera de lugar, se arregla redefiniendo un solo valor: es una discontinuidad evitable. Un salto entre dos niveles distintos no tiene arreglo. Una asíntota vertical manda la función al infinito. Y una oscilación cada vez más rápida impide que la función se decida por algún valor. Distinguir el tipo de discontinuidad dice cuánto se puede confiar en aproximar un valor con valores cercanos.

## Definición

:::definicion[Continuidad en un punto]
Una función $f$ es **continua en $a$** si se cumplen tres condiciones:
1. $f(a)$ está definido;
2. $\lim_{x \to a} f(x)$ existe;
3. $\lim_{x \to a} f(x) = f(a)$.

$f$ es **continua en un intervalo** si lo es en cada punto del intervalo (con límites laterales en los extremos cerrados).
:::

:::definicion[Tipos de discontinuidad]
Si $f$ no es continua en $a$, la discontinuidad es **evitable** si el límite existe pero es distinto de $f(a)$ o $f(a)$ no está definido; **de salto** si los límites laterales existen y son distintos; **infinita** si algún lateral es $\pm\infty$; y **esencial** u **oscilante** si algún lateral no existe.
:::

:::nota[Qué significa cada símbolo]
- $f$: función estudiada.
- $a$: punto donde se revisa la continuidad.
- $f(a)$: valor de la función en $a$.
- $\lim_{x \to a} f(x)$: límite de $f$ cuando $x$ se acerca a $a$.
- $\pm\infty$: crecimiento o decrecimiento sin cota.
:::

## Cómo usar la visualización

El selector elige una función con un comportamiento distinto en el punto $a$. Dos puntos se acercan a $a$ por ambos lados; el círculo vacío marca el límite y el lleno el valor $f(a)$. El texto bajo la fórmula y el panel clasifican la discontinuidad y dicen si la función es continua.

En el caso continuo, el círculo lleno cubre al vacío: límite y valor coinciden. En el hueco, los puntos se juntan en un lugar donde no hay valor. En el salto, cada punto se va a un nivel distinto. En la asíntota los puntos salen de la gráfica hacia arriba.

## Ejemplo

Un sensor reporta $f(x) = x + 1$ para $x \neq 1$, pero por un error de registro guarda $f(1) = 3$.

1. $f(1) = 3$ está definido.
2. $\lim_{x \to 1} f(x) = \lim_{x \to 1} (x + 1) = 2$: el límite existe.
3. Como $2 \neq 3$, falla la tercera condición: $f$ no es continua en 1.
4. La discontinuidad es evitable: redefinir $f(1) = 2$ la vuelve continua.
5. En la práctica, un dato aislado que no concuerda con sus vecinos es un candidato a error de medición.

:::figura[El registro del sensor del ejemplo: los valores cercanos a 1 apuntan a 2, pero el valor guardado en 1 es 3. Es una discontinuidad evitable.]{componente="CalculusViz"}
```yaml
modo: limite
casos: [removible-redefinida]
```
:::

## Propiedades

- **Operaciones:** sumas, productos, cocientes (con denominador no nulo) y composiciones de funciones continuas son continuas.
- **Funciones continuas básicas:** polinomios, $e^x$, $\operatorname{sen} x$, $\cos x$ en todo $\mathbb{R}$; $\log x$ y $\sqrt{x}$ en su dominio.
- **Teorema del valor intermedio:** si $f$ es continua en $[a, b]$ y $y$ está entre $f(a)$ y $f(b)$, existe $c \in [a, b]$ con $f(c) = y$.
- **Teorema de valores extremos:** una función continua en un intervalo cerrado y acotado alcanza un máximo y un mínimo.
- **Límites y continuidad:** si $g$ es continua en $L$ y $\lim f = L$, entonces $\lim g(f(x)) = g(L)$.
- **Continuidad y derivada:** toda función derivable es continua, pero no al revés: $|x|$ es continua en 0 y no es derivable ahí.

:::figura[Caso de discontinuidad de salto: |x|/x vale -1 a la izquierda de 0 y 1 a la derecha, y ningún valor en 0 puede unir ambos lados.]{componente="CalculusViz"}
```yaml
modo: limite
casos: [valor-absoluto]
```
:::

:::demostracion
Valor intermedio (idea): sea $c$ el supremo de los $x \in [a, b]$ con $f(x) < y$, suponiendo $f(a) < y < f(b)$. Si $f(c) < y$, por continuidad $f$ seguiría por debajo de $y$ un poco a la derecha de $c$, contradiciendo que $c$ es el supremo; si $f(c) > y$, seguiría por encima un poco a la izquierda, contradiciendo lo mismo. Queda $f(c) = y$.
:::

## Errores comunes

- **Revisar solo que la función esté definida.** Un valor definido que no coincide con el límite sigue siendo discontinuidad.
- **Concluir que $1/x$ no es una función continua.** Tiene una discontinuidad infinita en 0, pero 0 no pertenece a su dominio: en cada punto de $\mathbb{R} \setminus \{0\}$ es continua, así que es continua en todo su dominio. Las dos afirmaciones son ciertas a la vez y no se contradicen.
- **Aplicar el valor intermedio sin continuidad.** Una función de salto puede pasar de negativa a positiva sin anularse.
- **Confundir continuidad con derivabilidad.** Las esquinas son continuas y no derivables.

## Conexiones

La continuidad se define con [[limites]] sobre [[funciones-reales-y-sus-graficas|funciones reales]]. Es condición para la [[derivada-como-pendiente-y-razon-de-cambio|derivada]], garantiza la existencia de [[maximos-y-minimos]] en intervalos cerrados y permite definir la [[integral-definida-como-area|integral]]. En probabilidad, una variable aleatoria es continua cuando su función de distribución acumulada no tiene saltos, y la [[funcion-indicadora-y-funcion-escalon|función escalón]] es el ejemplo típico de discontinuidad de salto.

## Formulario

:::formula[Continuidad en un punto]
$$
\lim_{x \to a} f(x) = f(a)
$$

- $a$: punto de continuidad.
- Supone que $f(a)$ está definido y que el límite existe.
:::

:::formula[Salto]
$$
\lim_{x \to a^-} f(x) \neq \lim_{x \to a^+} f(x)
$$

- Los límites laterales existen pero son distintos.
:::

:::formula[Valor intermedio]
$$
f \in C[a, b],\ \ f(a) < y < f(b) \ \Rightarrow\ \exists\, c \in (a, b):\ f(c) = y
$$

- $C[a, b]$: funciones continuas en $[a, b]$.
- $y$: valor intermedio.
:::
