---
id: funciones-reales-y-sus-graficas
titulo: Funciones reales y sus gráficas
titulo_en: Real functions and their graphs
alias:
  - función real de variable real
  - gráfica de una función
  - transformaciones de gráficas
modulo: 0
submodulo: '0.4'
orden: 1
nivel: basico
prerrequisitos: []
relaciones:
  - tipo: caso-particular
    id: funciones
etiquetas:
  - funciones
  - gráficas
  - transformaciones
  - dominio
resumen: >
  Una función real asigna a cada número de su dominio un único número real; su gráfica es el conjunto de
  puntos (x, f(x)), y trasladarla, estirarla o reflejarla corresponde a operaciones simples con x y f(x).
formula: 'g(x) = a\,f\big(b(x - h)\big) + k'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: transformaciones
    funciones: [cuadrada, raiz, valor-absoluto, exponencial, seno]
    valores: [2, 1, -1, 1]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una función real es una regla que convierte un número en otro: la temperatura de un horno en función del tiempo, el costo de un envío en función del peso, la dosis de un medicamento en función de la masa corporal. Su gráfica dibuja todas esas parejas de entrada y salida como puntos del plano, y permite ver de un vistazo dónde crece, dónde decrece, dónde se anula o dónde se dispara.

Muchas funciones útiles son versiones modificadas de unas pocas funciones básicas, como $x^2$, $\sqrt{x}$, $|x|$, $e^x$ o $\operatorname{sen} x$. Sumar una constante a la salida sube la gráfica; restar una constante a la entrada la mueve hacia la derecha; multiplicar la salida la estira en vertical y multiplicar la entrada la comprime en horizontal. Un signo negativo refleja la gráfica. Reconocer estas cuatro operaciones permite leer fórmulas complicadas como una figura conocida que se movió.

## Definición

:::definicion[Función real y gráfica]
Una **función real de variable real** es una regla $f : D \to \mathbb{R}$ que asigna a cada $x$ de un conjunto $D \subseteq \mathbb{R}$, su **dominio**, un único número $f(x)$. Su **gráfica** es el conjunto
$$
\{(x, f(x)) : x \in D\} \subseteq \mathbb{R}^2,
$$
y su **imagen** o **rango** es $f(D) = \{f(x) : x \in D\}$.
:::

:::teorema[Transformaciones de la gráfica]
Si $g(x) = a\,f\big(b(x - h)\big) + k$ con $a, b \neq 0$, la gráfica de $g$ se obtiene de la de $f$ comprimiendo en horizontal por el factor $|b|$, trasladando $h$ unidades a la derecha, estirando en vertical por el factor $|a|$ y trasladando $k$ unidades hacia arriba; si $a < 0$ se refleja respecto al eje $x$ y si $b < 0$, respecto a la recta vertical $x = h$.
:::

:::nota[Qué significa cada símbolo]
- $f$: función original.
- $D$: dominio, los valores de entrada permitidos.
- $x$: variable independiente; $f(x)$: valor de salida.
- $\mathbb{R}$: números reales.
- $g$: función transformada.
- $a$: factor de estiramiento vertical (su signo refleja respecto al eje $x$).
- $b$: factor de compresión horizontal (su signo refleja respecto a un eje vertical).
- $h$: traslación horizontal, positiva hacia la derecha.
- $k$: traslación vertical, positiva hacia arriba.
:::

## Cómo usar la visualización

El selector elige la función básica $f$, dibujada con línea punteada, y los cuatro controles fijan $a$, $b$, $h$ y $k$. La reproducción transforma la gráfica paso a paso, desde $f$ hasta $g$, y el panel muestra el efecto de cada parámetro.

Con $h = 1$ la gráfica se mueve a la derecha aunque en la fórmula aparezca $x - 1$. Al cambiar $a$ de positivo a negativo, la gráfica se voltea sobre el eje horizontal. Con la función seno, llevar $b$ de 1 a 2 hace que complete dos ondas donde antes completaba una.

## Ejemplo

Una pelota lanzada desde una plataforma sigue la altura $g(t) = -2(t - 1)^2 + 3$ metros, $t$ en segundos. Se lee como una transformación de $f(t) = t^2$.

1. $a = -2$: la parábola se estira al doble y se voltea, así que abre hacia abajo.
2. $b = 1$: no hay compresión horizontal.
3. $h = 1$: el vértice se mueve de $t = 0$ a $t = 1$.
4. $k = 3$: el vértice sube a altura 3. La altura máxima es 3 m y se alcanza en $t = 1$ s.
5. La pelota toca el suelo cuando $-2(t - 1)^2 + 3 = 0$, es decir, $t = 1 + \sqrt{1.5} \approx 2.22$ s.

:::figura[La trayectoria de la pelota del ejemplo como transformación de t²: se voltea, se estira al doble y su vértice se mueve a (1, 3).]{componente="CalculusViz"}
```yaml
modo: transformaciones
funciones: [cuadrada]
valores: [-2, 1, 1, 3]
```
:::

## Propiedades

- **Prueba de la recta vertical:** una curva del plano es gráfica de una función si ninguna recta vertical la corta en más de un punto.
- **Ceros:** los puntos donde la gráfica corta el eje $x$ son las soluciones de $f(x) = 0$.
- **Simetrías:** $f$ es par si $f(-x) = f(x)$ (simétrica respecto al eje $y$) e impar si $f(-x) = -f(x)$ (simétrica respecto al origen).
- **Monotonía:** $f$ es creciente si $x_1 < x_2$ implica $f(x_1) \le f(x_2)$.
- **Orden de las transformaciones:** en $a\,f(b(x - h)) + k$ primero se comprime y luego se traslada; escribir $f(bx - h)$ traslada $h/b$, no $h$.
- **Periodicidad:** $f$ es periódica de periodo $T$ si $f(x + T) = f(x)$; comprimir por $b$ divide el periodo entre $|b|$.

:::figura[Caso de compresión horizontal en una función periódica: con b = 2 el seno completa sus ondas en la mitad de espacio, así que su periodo pasa de 2π a π.]{componente="CalculusViz"}
```yaml
modo: transformaciones
funciones: [seno]
valores: [1, 2, 0, 0]
```
:::

## Errores comunes

- **Mover la gráfica en la dirección del signo.** $f(x - 3)$ se desplaza a la derecha, no a la izquierda.
- **Confundir $f(2x)$ con $2f(x)$.** La primera comprime en horizontal; la segunda estira en vertical.
- **Olvidar el dominio.** $\sqrt{x - 2}$ solo existe para $x \ge 2$; la traslación también mueve el dominio.
- **Leer una gráfica sin escalas.** Dos gráficas con la misma forma pueden representar magnitudes muy distintas.

## Conexiones

Estas funciones son el caso numérico de las [[funciones]] entre conjuntos. A partir de ellas se estudian los [[limites]], la [[continuidad]] y la [[derivada-como-pendiente-y-razon-de-cambio|derivada]]. Las funciones [[funcion-exponencial-y-logaritmo-natural|exponencial y logaritmo]] y la [[funcion-sigmoide-y-funcion-softplus|sigmoide]] son ejemplos centrales en ciencia de datos, y las transformaciones de esta ficha reaparecen al estandarizar variables y al reparametrizar distribuciones.

## Formulario

:::formula[Gráfica e imagen]
$$
\operatorname{graf}(f) = \{(x, f(x)) : x \in D\}, \qquad f(D) = \{f(x) : x \in D\}
$$

- $D$: dominio.
- $f(D)$: imagen o rango.
:::

:::formula[Transformación general]
$$
g(x) = a\,f\big(b(x - h)\big) + k
$$

- $a$: estiramiento vertical; $b$: compresión horizontal.
- $h$: traslación a la derecha; $k$: traslación hacia arriba.
:::

:::formula[Paridad]
$$
f(-x) = f(x) \ \text{(par)}, \qquad f(-x) = -f(x) \ \text{(impar)}
$$

- Par: simétrica respecto al eje $y$; impar: simétrica respecto al origen.
:::

:::formula[Periodo tras comprimir]
$$
f(x + T) = f(x) \ \Rightarrow\ f(bx) \text{ tiene periodo } \frac{T}{|b|}
$$

- $T$: periodo de $f$.
- $b$: factor de compresión.
:::
