---
id: algoritmo-ziggurat
titulo: Algoritmo Ziggurat
titulo_en: Ziggurat algorithm
alias:
  - método del zigurat
  - zigurat de Marsaglia y Tsang
modulo: 2
submodulo: '2.5'
orden: 9
nivel: avanzado
prerrequisitos:
  - metodo-de-aceptacion-y-rechazo
  - distribucion-normal
relaciones:
  - tipo: contrasta
    id: metodo-de-box-muller
etiquetas:
  - normal
  - rechazo
  - tablas precalculadas
  - eficiencia
  - capas de igual área
resumen: >
  Método muy rápido para generar normales o exponenciales: cubre la densidad con capas rectangulares de
  igual área y, en la gran mayoría de los casos, acepta el valor sin evaluar la densidad.
formula: 'x_{i+1} = f^{-1}\!\left(f(x_i) + \frac{v}{x_i}\right), \qquad v = r f(r) + \int_r^{\infty} f(x)\,dx'
visualizacion:
  componente: RandomLab
  parametros:
    modo: ziggurat
    valores:
      capas: 8
    casos:
      - nombre: 'Pocas capas'
        descripcion: 'Con 8 capas los escalones son anchos: cerca del 73 % de los intentos cae en el núcleo y se acepta sin calcular la exponencial.'
        valores: {capas: 8}
      - nombre: 'Más capas'
        descripcion: 'Con 32 capas los escalones abrazan la curva y cerca del 91 % de los intentos se acepta directamente.'
        valores: {capas: 32}
      - nombre: 'Mínimo de capas'
        descripcion: 'Con 4 capas los bordes son grandes y una buena parte de los intentos requiere evaluar la densidad.'
        valores: {capas: 4}
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Los métodos de Box-Muller y polar calculan un logaritmo y una raíz por cada par de normales. Cuando hay que generar cientos de millones de normales, por ejemplo en simulaciones financieras o físicas, incluso eso cuesta. El zigurat, de Marsaglia y Tsang, evita casi siempre cualquier función costosa.

La idea es cubrir la mitad derecha de la campana normal con una pila de rectángulos horizontales de igual área, como los escalones de un zigurat, más una franja de base que incluye la cola. Para generar un valor se elige una capa al azar y un punto horizontal dentro de ella. La mayor parte de cada rectángulo, su núcleo, queda completamente bajo la curva: si el punto cae ahí, se acepta de inmediato, con solo una multiplicación y una comparación. Solo en los bordes, donde el escalón sobresale de la curva, hace falta evaluar la densidad y decidir por rechazo, y en la base se sortea la cola con un método especial.

Con 128 o 256 capas, más del 97 % de los intentos se resuelve en el núcleo. Las posiciones de los escalones se calculan una sola vez y se guardan en tablas, por eso el método es tan rápido.

## Definición

:::definicion[Zigurat de la semi normal]
Sea $f(x) = e^{-x^{2}/2}$ para $x \ge 0$. Con $n$ capas se buscan bordes $r = x_0 > x_1 > \dots > x_{n-2} > x_{n-1} = 0$ y un área común $v$ tales que:

- la base, formada por el rectángulo $[0, r] \times [0, f(r)]$ y la cola $\{x > r\}$, tiene área $v = r f(r) + \int_r^{\infty} f(x)\,dx$;
- cada capa $i = 1, \dots, n - 1$ es el rectángulo $[0, x_{i-1}] \times [f(x_{i-1}), f(x_i)]$, con área $x_{i-1}\big(f(x_i) - f(x_{i-1})\big) = v$;
- la última capa termina en la cima: $f(x_{n-1}) = f(0) = 1$.

Los bordes cumplen la recursión $x_i = f^{-1}\big(f(x_{i-1}) + v/x_{i-1}\big)$, y $r$ se ajusta numéricamente para que la pila cierre en la cima.
:::

Para generar: se elige una capa $i$ al azar y $x = U\,x_{i-1}$. Si $x < x_i$, se acepta (núcleo). Si no, se sortea una altura en la capa y se acepta si queda bajo $f(x)$. En la base, los valores más allá de $r$ se toman de la cola. Un signo al azar da la normal completa.

:::nota[Qué es X]
$X$ = el valor generado, con densidad semi normal; con un signo al azar, una normal estándar.
:::

:::nota[Qué hace cada parámetro]
- **$n$, número de capas:** cuántos escalones cubren la curva. Si aumenta, los escalones se ajustan mejor a la curva, el núcleo de cada uno crece y la fracción aceptada sin evaluar la densidad se acerca a 1.
:::

:::nota[Qué significa cada símbolo]
- $f(x) = e^{-x^{2}/2}$: densidad semi normal sin normalizar; $f^{-1}$: su inversa, $\sqrt{-2\log y}$.
- $n$: número de capas; $x_i$: borde derecho de la capa $i$; $r = x_0$: borde de la base.
- $v$: área común de todas las capas.
- $U$: uniforme para la posición horizontal.
:::

## Cómo usar la visualización

La curva es la semi normal y los rectángulos son las capas; las líneas punteadas verticales separan el núcleo de cada capa de su borde. Cada paso de la reproducción hace un intento y el botón agrega 500; los puntos se colorean según se aceptaron en el núcleo, en el borde tras evaluar la densidad, se rechazaron o vinieron de la cola. El panel da $r$, el área de cada capa y la fracción aceptada sin evaluar la densidad. Los casos cargan 8, 32 y 4 capas.

Con 8 capas agrega 2000 intentos y observa que la mayoría cae en el núcleo. Sube a 32 y observa que los bordes se vuelven delgados. Baja a 4 y observa más rechazos.

## Ejemplo

Se construye el zigurat con 8 capas.

1. Ajustando $r$ para que la pila cierre en la cima se obtiene $r \approx 2.338$ y área por capa $v \approx 0.1762$.
2. Los bordes son 2.338, 1.982, 1.717, 1.485, 1.263, 1.027, 0.738 y 0.
3. En la capa $i$, la fracción del rectángulo que es núcleo es $x_i/x_{i-1}$; por ejemplo, en la segunda capa, $1.717/1.982 \approx 0.87$.
4. Promediando sobre las capas, cerca del 73 % de los intentos se acepta sin evaluar la exponencial.
5. Con 128 capas, $r \approx 3.4426$, $v \approx 0.00991$ y la fracción sube a cerca del 97 %; el área bajo la curva es el 98.8 % del área total de las capas.

:::figura[Pocas capas: ocho rectángulos de igual área cubren la semi normal; los puntos en el núcleo de cada capa se aceptan sin evaluar la densidad.]{componente="RandomLab"}
```yaml
modo: ziggurat
valores:
  capas: 8
```
:::

## Propiedades

- **Igual área:** todas las capas tienen área $v$, así que elegir una capa al azar con probabilidad $1/n$ equivale a muestrear uniformemente bajo la pila.
- **Exactitud:** combina aceptación y rechazo en los bordes con un método exacto para la cola, de modo que la distribución generada es exactamente la normal.
- **Rapidez:** en el núcleo basta una uniforme, una multiplicación y una comparación con valores de tabla.
- **Cola:** se muestrea con el método de Marsaglia: $X = r + E_1/r$ con $E_1, E_2$ exponenciales, aceptado si $2E_2 > (E_1/r)^{2}$.
- **Generalidad:** sirve para cualquier densidad decreciente, como la exponencial; para densidades simétricas se aplica a una mitad y se sortea el signo.

:::figura[Casos con contexto (pocas capas, más capas, mínimo de capas): cada botón carga el número de capas y una frase explica cuántos intentos se resuelven en el núcleo.]{componente="RandomLab"}
```yaml
modo: ziggurat
valores:
  capas: 32
casos:
  - nombre: 'Pocas capas'
    descripcion: '8 capas: 73 % en el núcleo.'
    valores: {capas: 8}
  - nombre: 'Más capas'
    descripcion: '32 capas: 91 % en el núcleo.'
    valores: {capas: 32}
  - nombre: 'Mínimo de capas'
    descripcion: '4 capas: muchos bordes.'
    valores: {capas: 4}
```
:::

## Errores comunes

- **Olvidar la cola.** Si se trunca en $r$, la distribución pierde los valores extremos; con 128 capas la cola tiene probabilidad pequeña, pero no nula.
- **Usar capas de igual altura en lugar de igual área.** Elegir la capa uniformemente solo es correcto si todas tienen la misma área.
- **Reutilizar bits de la uniforme.** Las implementaciones rápidas toman el índice de la capa y la posición de la misma palabra; si el generador tiene bits bajos pobres, aparecen sesgos.
- **Creer que es aproximado.** El zigurat produce normales exactas; la tabla solo acelera el caso común.

:::figura[Mínimo de capas: con 4 capas los bordes son anchos y una fracción importante de los intentos necesita evaluar la densidad o se rechaza.]{componente="RandomLab"}
```yaml
modo: ziggurat
valores:
  capas: 4
```
:::

## Conexiones

Es una forma refinada del [[metodo-de-aceptacion-y-rechazo]] para la [[distribucion-normal]] y la [[distribucion-exponencial]]. Compite con el [[metodo-de-box-muller]] y el [[metodo-polar-de-marsaglia]], a los que supera en velocidad, y necesita uniformes de buenos [[generadores-de-numeros-pseudoaleatorios]]. Para distribuciones discretas, el método análogo de tablas precalculadas es el [[metodo-del-alias-para-distribuciones-discretas|método del alias]]. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Área de la base]
$$
v = r\,f(r) + \int_r^{\infty} f(x)\,dx, \qquad f(x) = e^{-x^{2}/2}
$$

- $r$: borde de la base; $v$: área común de las capas.
:::

:::formula[Recursión de los bordes]
$$
x_i = f^{-1}\!\left(f(x_{i-1}) + \frac{v}{x_{i-1}}\right), \qquad f^{-1}(y) = \sqrt{-2\log y}
$$

- $x_i$: bordes, de $x_0 = r$ hasta $x_{n-1} = 0$.
:::

:::formula[Fracción del núcleo en la capa i]
$$
\frac{x_i}{x_{i-1}}
$$

- Fracción del rectángulo que queda bajo la curva con seguridad.
:::

:::formula[Cola]
$$
X = r + \frac{E_1}{r}, \qquad \text{aceptar si } 2E_2 > \left(\frac{E_1}{r}\right)^{2}
$$

- $E_1$, $E_2$: exponenciales estándar independientes.
:::
