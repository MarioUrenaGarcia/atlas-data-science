---
id: sumas-de-riemann
titulo: Sumas de Riemann
titulo_en: Riemann sums
alias:
  - suma de Riemann
  - regla del trapecio
  - regla del punto medio
  - integración numérica
modulo: 0
submodulo: '0.4'
orden: 13
nivel: basico
prerrequisitos:
  - continuidad
  - notacion-sumatoria-y-productoria
etiquetas:
  - integrales
  - aproximación
  - rectángulos
  - integración numérica
resumen: >
  Una suma de Riemann aproxima el área bajo una curva partiendo el intervalo en piezas y sumando áreas de
  rectángulos; al refinar la partición, las sumas se acercan a la integral definida.
formula: 'S_n = \sum_{i=1}^{n} f(x_i^{*})\,\Delta x, \qquad \Delta x = \frac{b - a}{n}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: riemann
    funcion: gauss
    intervalo: [-2, 2]
    regla: punto-medio
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Para medir el área de un terreno con un borde curvo se puede dividir en franjas angostas, aproximar cada franja por un rectángulo y sumar las áreas de los rectángulos. Cuanto más angostas las franjas, menos importa que el borde no sea recto, y la suma se acerca al área verdadera.

Las sumas de Riemann aplican esa idea al área bajo la gráfica de una función. Se parte el intervalo en $n$ piezas iguales, en cada pieza se elige una altura (el valor de la función en el extremo izquierdo, en el derecho o en el centro) y se suman base por altura. Cambiar la regla para elegir la altura cambia el error, pero todas convergen al mismo número cuando $n$ crece. Ese número límite es la integral definida, y las propias sumas son la base de los métodos numéricos con que las computadoras calculan integrales.

## Definición

:::definicion[Suma de Riemann]
Sea $f$ definida en $[a, b]$, $n \ge 1$, $\Delta x = \frac{b - a}{n}$ y $x_i = a + i\,\Delta x$. Una **suma de Riemann** es
$$
S_n = \sum_{i=1}^{n} f(x_i^{*})\,\Delta x, \qquad x_i^{*} \in [x_{i-1}, x_i].
$$
Con $x_i^{*} = x_{i-1}$ es la suma por la **izquierda**; con $x_i^{*} = x_i$, por la **derecha**; con el centro, la del **punto medio**. La **regla del trapecio** usa la altura promedio $\tfrac{1}{2}\big(f(x_{i-1}) + f(x_i)\big)$.
:::

:::teorema[Convergencia]
Si $f$ es continua en $[a, b]$, todas las sumas de Riemann convergen al mismo límite cuando $n \to \infty$, sin importar cómo se elijan los $x_i^{*}$. Ese límite es la integral $\int_a^b f(x)\,dx$.
:::

:::nota[Qué significa cada símbolo]
- $[a, b]$: intervalo de integración.
- $n$: número de piezas.
- $\Delta x$: ancho de cada pieza.
- $x_i$: extremos de la partición, con $x_0 = a$ y $x_n = b$.
- $x_i^{*}$: punto de la pieza $i$ donde se toma la altura.
- $f(x_i^{*})\,\Delta x$: área con signo del rectángulo $i$.
- $S_n$: suma de Riemann con $n$ piezas.
:::

## Cómo usar la visualización

La curva es $e^{-x^2}$ en $[-2, 2]$. La reproducción duplica el número de piezas, de 1 a 128, y dibuja los rectángulos (o trapecios) de cada suma; las piezas bajo el eje aparecen en rosa porque restan. El selector cambia la regla de altura y el panel compara la suma con la integral exacta.

Con la regla del punto medio el error cae muy rápido: al duplicar $n$ se divide aproximadamente entre cuatro. En esta curva, como $f(-2) = f(2)$, las sumas izquierda y derecha coinciden entre sí y con la del trapecio, y convergen casi tan rápido como el punto medio. Es un caso especial: en una función con valores distintos en los extremos, como $x^2$ en $[0, 2]$ del ejemplo, las sumas izquierda y derecha quedan de lados opuestos de la integral y su error solo se divide entre dos al duplicar $n$.

## Ejemplo

Un tanque se llena con un caudal de $f(t) = t^2$ litros por minuto durante 2 minutos. Se estima el volumen con 4 piezas.

1. $\Delta t = \frac{2 - 0}{4} = 0.5$ y los extremos son $0, 0.5, 1, 1.5, 2$.
2. Por la izquierda: $0.5\,(0 + 0.25 + 1 + 2.25) = 1.75$ litros.
3. Por la derecha: $0.5\,(0.25 + 1 + 2.25 + 4) = 3.75$ litros.
4. Punto medio: $0.5\,(0.0625 + 0.5625 + 1.5625 + 3.0625) = 2.625$ litros.
5. El volumen exacto es $\frac{2^3}{3} \approx 2.667$ litros: izquierda subestima, derecha sobreestima (la función crece) y el punto medio queda muy cerca.

:::figura[El tanque del ejemplo con rectángulos por la izquierda: la suma se queda corta porque la función crece y cada rectángulo usa la altura más baja de su pieza. Al duplicar las piezas el error se reduce a la mitad.]{componente="CalculusViz"}
```yaml
modo: riemann
funcion: cuadrada
intervalo: [0, 2]
regla: izquierda
```
:::

## Propiedades

- **Errores de cada regla:** para $f$ suave, izquierda y derecha tienen error de orden $1/n$; punto medio y trapecio, de orden $1/n^2$.
- **Monotonía:** si $f$ es creciente, la suma por la izquierda subestima y la de la derecha sobreestima.
- **Convexidad:** si $f$ es convexa, el trapecio sobreestima y el punto medio subestima.
- **Área con signo:** los rectángulos bajo el eje contribuyen con signo negativo.
- **Promedio:** $\frac{1}{b - a}S_n$ es el promedio de $f$ en los puntos elegidos; en el límite da el valor promedio de $f$ en $[a, b]$.
- **Regla de Simpson:** una combinación del punto medio y el trapecio, $\tfrac{2}{3}M_n + \tfrac{1}{3}T_n$, tiene error de orden $1/n^4$.

:::figura[Caso de la regla del trapecio sobre sen x en [0, π]: los trapecios siguen la curva mucho mejor que los rectángulos, y la suma se acerca rápidamente al valor exacto 2.]{componente="CalculusViz"}
```yaml
modo: riemann
funcion: seno
intervalo: [0, 3.1416]
regla: trapecio
```
:::

:::demostracion
Monotonía: si $f$ es creciente, en cada pieza $f(x_{i-1}) \le f(x) \le f(x_i)$. El rectángulo izquierdo queda bajo la curva y el derecho la contiene, así que la suma izquierda es menor o igual que el área y la derecha mayor o igual.
:::

## Errores comunes

- **Olvidar multiplicar por $\Delta x$.** La suma de alturas sola no es un área.
- **Usar $n + 1$ rectángulos.** Con $n$ piezas hay $n + 1$ extremos pero solo $n$ rectángulos.
- **Tratar las áreas bajo el eje como positivas.** En la suma de Riemann cuentan con signo.
- **Confiar en pocas piezas con funciones que oscilan.** Una partición gruesa puede no ver las oscilaciones y dar un resultado engañoso.

## Conexiones

Las sumas de Riemann se escriben con [[notacion-sumatoria-y-productoria|notación sumatoria]] y su límite existe gracias a la [[continuidad]]. Ese límite es la [[integral-definida-como-area]], que el [[teorema-fundamental-del-calculo]] permite calcular sin sumas. En estadística, el método de Monte Carlo reemplaza la partición regular por puntos aleatorios y estima integrales con promedios de muestras.

## Formulario

:::formula[Suma de Riemann]
$$
S_n = \sum_{i=1}^{n} f(x_i^{*})\,\Delta x, \qquad \Delta x = \frac{b - a}{n}
$$

- $x_i^{*}$: punto elegido en la pieza $i$.
- $n$: número de piezas.
:::

:::formula[Punto medio y trapecio]
$$
M_n = \sum_{i=1}^{n} f\Big(\frac{x_{i-1} + x_i}{2}\Big)\Delta x, \qquad T_n = \sum_{i=1}^{n}\frac{f(x_{i-1}) + f(x_i)}{2}\,\Delta x
$$

- $x_i = a + i\,\Delta x$.
:::

:::formula[Integral como límite]
$$
\int_a^b f(x)\,dx = \lim_{n \to \infty} S_n
$$

- Para $f$ continua en $[a, b]$.
:::

:::formula[Simpson]
$$
S = \tfrac{2}{3}M_n + \tfrac{1}{3}T_n
$$

- Error de orden $1/n^{4}$ para $f$ suave.
:::
