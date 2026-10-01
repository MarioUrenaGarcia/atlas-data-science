---
id: teorema-fundamental-del-calculo
titulo: Teorema fundamental del cálculo
titulo_en: Fundamental theorem of calculus
alias:
  - TFC
  - antiderivada
  - primitiva
  - regla de Barrow
modulo: 0
submodulo: '0.4'
orden: 15
nivel: basico
prerrequisitos:
  - integral-definida-como-area
  - derivada-como-pendiente-y-razon-de-cambio
etiquetas:
  - antiderivadas
  - integral
  - derivada
  - acumulación
resumen: >
  Derivar y acumular son operaciones inversas: la función área acumulada tiene como derivada al integrando,
  y una integral definida se calcula como la diferencia de una antiderivada en los extremos.
formula: '\frac{d}{dx}\int_a^x f(t)\,dt = f(x), \qquad \int_a^b f(x)\,dx = F(b) - F(a)'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: acumulada
    funcion: coseno
    desde: 0
    hasta: 6.28
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

El odómetro de un auto acumula la distancia recorrida y el velocímetro marca la velocidad. Si se conoce el odómetro en cada instante, la velocidad es su ritmo de cambio; si se conoce la velocidad, el odómetro es su acumulación. Derivar y acumular son operaciones opuestas.

El teorema fundamental del cálculo dice exactamente eso. Si se define $F(x)$ como el área acumulada bajo $f$ desde un punto fijo hasta $x$, al mover $x$ un poco el área crece en una franja delgada de altura $f(x)$: la pendiente de $F$ es $f$. Y la consecuencia práctica es enorme: para calcular una integral definida no hace falta sumar rectángulos, basta encontrar una función cuya derivada sea el integrando y restar sus valores en los extremos.

## Definición

:::teorema[Primera parte]
Si $f$ es continua en $[a, b]$ y $F(x) = \int_a^x f(t)\,dt$, entonces $F$ es derivable en $(a, b)$ y
$$
F'(x) = f(x).
$$
:::

:::teorema[Segunda parte]
Si $f$ es continua en $[a, b]$ y $G$ es cualquier **antiderivada** de $f$, es decir, $G' = f$, entonces
$$
\int_a^b f(x)\,dx = G(b) - G(a) = \big[G(x)\big]_a^b.
$$
:::

Las antiderivadas de $f$ difieren en una constante, y su conjunto se escribe $\int f(x)\,dx = G(x) + C$, la **integral indefinida**.

:::nota[Qué significa cada símbolo]
- $f$: función continua que se integra.
- $t$: variable de integración, muda.
- $F(x) = \int_a^x f(t)\,dt$: área acumulada desde $a$ hasta $x$.
- $G$: antiderivada de $f$, con $G' = f$.
- $[G(x)]_a^b$: abreviatura de $G(b) - G(a)$.
- $C$: constante arbitraria.
:::

## Cómo usar la visualización

Arriba, la reproducción rellena el área bajo $\cos t$ desde 0 hasta un $x$ que avanza; la barra vertical amarilla marca la altura $f(x)$. Abajo se traza la función acumulada $F(x)$ con su recta tangente. El encabezado muestra $F(x)$ y su pendiente, que coincide con la altura de arriba.

Mientras el coseno es positivo, el área acumulada crece y $F$ sube; cuando el coseno se vuelve negativo, el área empieza a restar y $F$ baja. Los máximos de $F$ ocurren justo donde $f$ cruza el cero. La curva trazada abajo es $\operatorname{sen} x$, una antiderivada del coseno.

## Ejemplo

Una bomba llena un tanque con caudal $q(t) = t^2$ litros por minuto. Se calcula el volumen que entra entre $t = 1$ y $t = 3$.

1. Una antiderivada de $t^2$ es $G(t) = \frac{t^3}{3}$, porque $G'(t) = t^2$.
2. $\int_1^3 t^2\,dt = G(3) - G(1) = 9 - \frac{1}{3} = \frac{26}{3} \approx 8.667$ litros.
3. La función volumen desde $t = 0$ es $V(t) = \int_0^t s^2\,ds = \frac{t^3}{3}$.
4. Por la primera parte, $V'(t) = t^2 = q(t)$: el ritmo de llenado es el caudal.
5. Con sumas de Riemann se necesitarían cientos de rectángulos para igualar esta precisión.

:::figura[El tanque del ejemplo: el área bajo t² desde 0 genera la curva t³/3, cuya pendiente en cada punto es el caudal t².]{componente="CalculusViz"}
```yaml
modo: acumulada
funcion: cuadrada
desde: 0
hasta: 3
nombre: V
```
:::

## Propiedades

- **Antiderivadas básicas:** $\int x^n dx = \frac{x^{n+1}}{n + 1} + C$ ($n \neq -1$), $\int \frac{dx}{x} = \log|x| + C$, $\int e^x dx = e^x + C$, $\int \cos x\,dx = \operatorname{sen} x + C$.
- **Límite superior variable:** $\frac{d}{dx}\int_a^{g(x)} f(t)\,dt = f(g(x))\,g'(x)$.
- **Cambio neto:** $\int_a^b G'(x)\,dx = G(b) - G(a)$: integrar un ritmo de cambio da el cambio total.
- **Funciones de distribución:** si $p$ es una densidad, $F(x) = \int_{-\infty}^{x} p(t)\,dt$ es la distribución acumulada y $F' = p$.
- **No toda integral tiene fórmula cerrada:** $\int e^{-x^2}dx$ no se expresa con funciones elementales; define la función error.

:::demostracion
Primera parte: $\frac{F(x + h) - F(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\,dt$, que es el valor promedio de $f$ en $[x, x + h]$. Por el valor medio para integrales, es $f(c_h)$ con $c_h$ entre $x$ y $x + h$, y por continuidad $f(c_h) \to f(x)$ cuando $h \to 0$.
:::

## Errores comunes

- **Olvidar la constante en la integral indefinida.** $\int 2x\,dx = x^2 + C$; en la definida la constante se cancela.
- **Aplicarlo con discontinuidades.** $\int_{-1}^{1}\frac{dx}{x^2}$ no es $\big[-\frac{1}{x}\big]_{-1}^{1} = -2$; la función no es continua en 0 y la integral diverge.
- **Confundir la variable muda con el límite.** En $\int_a^x f(t)\,dt$ el resultado depende de $x$, no de $t$.
- **Creer que toda función continua tiene antiderivada elemental.** Existe la antiderivada, pero puede no tener fórmula con funciones conocidas.

## Conexiones

El teorema une la [[derivada-como-pendiente-y-razon-de-cambio|derivada]] con la [[integral-definida-como-area|integral]]. Para encontrar antiderivadas se usan la [[integracion-por-sustitucion]] y la [[integracion-por-partes]]; cuando no hay fórmula cerrada aparecen funciones nuevas como la [[funcion-error]]. En probabilidad, la relación entre densidad y función de distribución acumulada es este mismo teorema.

## Formulario

:::formula[Primera parte]
$$
\frac{d}{dx}\int_a^x f(t)\,dt = f(x)
$$

- $f$: continua.
- $t$: variable de integración.
:::

:::formula[Segunda parte]
$$
\int_a^b f(x)\,dx = G(b) - G(a), \qquad G' = f
$$

- $G$: antiderivada de $f$.
:::

:::formula[Antiderivadas básicas]
$$
\int x^{n}dx = \frac{x^{n+1}}{n + 1} + C, \quad \int \frac{dx}{x} = \log|x| + C, \quad \int e^{x}dx = e^{x} + C
$$

- $n \neq -1$.
- $C$: constante de integración.
:::

:::formula[Límite superior variable]
$$
\frac{d}{dx}\int_a^{g(x)} f(t)\,dt = f\big(g(x)\big)\,g'(x)
$$

- $g$: función derivable.
:::
