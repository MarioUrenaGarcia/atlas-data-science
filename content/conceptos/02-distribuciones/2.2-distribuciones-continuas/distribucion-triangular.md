---
id: distribucion-triangular
titulo: Distribución triangular
titulo_en: Triangular distribution
alias:
  - triangular
  - distribución de tres puntos
modulo: 2
submodulo: '2.2'
orden: 23
nivel: basico
prerrequisitos:
  - distribucion-uniforme-continua
relaciones:
  - tipo: relacionado
    id: distribucion-beta
etiquetas:
  - distribución continua
  - estimación de proyectos
  - mínimo, moda y máximo
  - suma de uniformes
resumen: >
  Distribución definida por un mínimo, un valor más probable y un máximo, con densidad en forma de
  triángulo. Se usa cuando solo se conocen esos tres valores, como en la estimación de duraciones de tareas.
formula: 'f(x) = \begin{cases} \frac{2(x - a)}{(b - a)(c - a)}, & a \le x \le c \\ \frac{2(b - x)}{(b - a)(b - c)}, & c < x \le b \end{cases}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: triangular
      valores:
        a: 2
        c: 4
        b: 9
      casos:
        - nombre: 'Simétrica'
          descripcion: 'Mínimo 1, moda 5 y máximo 9: la moda está en el centro y el triángulo es simétrico, como la suma de dos uniformes.'
          valores: {a: 1, c: 5, b: 9}
        - nombre: 'Tarea con retrasos'
          descripcion: 'Mínimo 2, moda 4 y máximo 9 días: lo usual es terminar pronto, pero los retrasos alargan la cola derecha.'
          valores: {a: 2, c: 4, b: 9}
        - nombre: 'Casi siempre al tope'
          descripcion: 'Mínimo 1, moda 8 y máximo 9: un proceso que casi siempre llega cerca de su límite superior; sesgo a la izquierda.'
          valores: {a: 1, c: 8, b: 9}
      ejemplo:
        titulo: 'Duración de una tarea'
        contexto: 'Un equipo estima que una tarea tarda al menos 2 días, lo más probable es 4 y como máximo 9.'
        pregunta: '¿Qué probabilidad hay de que tarde más de 7 días?'
        valores: {a: 2, c: 4, b: 9}
        region: derecha
        desde: 7
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: suma-uniformes
        valores:
          n: 2
        fijos: [n]
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Un jefe de proyecto pregunta cuánto tardará una tarea y el equipo responde con tres números: si todo sale bien, 2 días; lo más probable, 4; y si todo sale mal, 9. No hay datos históricos para ajustar una distribución elaborada, pero esos tres números bastan para construir una distribución triangular: la densidad sube en línea recta desde el mínimo hasta el valor más probable y baja en línea recta hasta el máximo.

La triangular es la forma más simple que respeta límites duros y un valor típico. Cuando la moda está más cerca del mínimo que del máximo, como en el ejemplo, la cola derecha es más larga y la media queda por encima del valor más probable, lo que refleja que los retrasos suelen ser mayores que los adelantos.

También aparece de manera natural: la suma de dos números uniformes independientes en $[0, 1]$ tiene densidad triangular en $[0, 2]$ con moda en 1. Por eso la suma de dos dados tiene forma de triángulo. En simulación de riesgos y en la gestión de proyectos se usa como alternativa sencilla a la distribución beta.

## Definición

:::definicion[Distribución triangular]
Sean $a < b$ y $a \le c \le b$. Una variable $X$ tiene **distribución triangular** con mínimo $a$, moda $c$ y máximo $b$ si
$$
f(x) = \begin{cases} \dfrac{2(x - a)}{(b - a)(c - a)}, & a \le x \le c, \\ \dfrac{2(b - x)}{(b - a)(b - c)}, & c < x \le b, \end{cases}
$$
y $f(x) = 0$ fuera de $[a, b]$. Su función de distribución es $F(x) = \frac{(x - a)^{2}}{(b - a)(c - a)}$ para $a \le x \le c$ y $F(x) = 1 - \frac{(b - x)^{2}}{(b - a)(b - c)}$ para $c < x \le b$.
:::

:::nota[Qué es X]
$X$ = una cantidad con mínimo, máximo y valor más probable conocidos, como la duración estimada de una tarea.
:::

:::nota[Qué hace cada parámetro]
- **$a$, mínimo:** el menor valor posible. Si aumenta, el triángulo se acorta por la izquierda y sube.
- **$c$, moda:** el valor más probable. Si aumenta, el pico se mueve a la derecha.
- **$b$, máximo:** el mayor valor posible. Si aumenta, el triángulo se alarga por la derecha y baja.
:::

:::nota[Qué significa cada símbolo]
- $X$: cantidad con límites conocidos.
- $a$: mínimo posible.
- $c$: moda, el valor más probable.
- $b$: máximo posible.
- $f(x)$: densidad, con altura máxima $2/(b - a)$ en la moda.
- $F(x)$: probabilidad acumulada hasta $x$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra el triángulo, la región elegida y su probabilidad; los casos cargan una triangular simétrica, una sesgada a la derecha y una sesgada a la izquierda, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge suma dos números uniformes y muestra cómo se forma el triángulo simétrico en $[0, 2]$.

Al mover la moda hacia el mínimo la media se aleja de ella hacia la derecha. La altura del vértice siempre es $2/(b - a)$, porque el área del triángulo debe ser uno.

## Ejemplo

La duración de una tarea, en días, sigue una triangular con $a = 2$, $c = 4$ y $b = 9$.

1. Duración media: $(a + b + c)/3 = 15/3 = 5$ días, un día más que la moda.
2. Probabilidad de terminar en 4 días o menos: $\frac{(4 - 2)^{2}}{7 \cdot 2} = \frac{4}{14} \approx 0.286$.
3. Probabilidad de tardar más de 7 días: $\frac{(9 - 7)^{2}}{7 \cdot 5} = \frac{4}{35} \approx 0.114$.
4. Plazo que se cumple con probabilidad 0.9: alrededor de 7.13 días.

:::figura[Duración de la tarea: el área sombreada a la derecha de 7 días vale 0.114. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: triangular
valores:
  a: 2
  c: 4
  b: 9
ejemplo:
  titulo: 'Duración de una tarea'
  contexto: 'Una tarea tarda al menos 2 días, lo más probable es 4 y como máximo 9.'
  pregunta: '¿Qué probabilidad hay de que tarde más de 7 días?'
  valores: {a: 2, c: 4, b: 9}
  region: derecha
  desde: 7
region: derecha
desde: 7
probabilidad: 0.9
muestras: false
```
:::

## Propiedades

- **Media:** $\frac{a + b + c}{3}$.
- **Varianza:** $\frac{a^{2} + b^{2} + c^{2} - ab - ac - bc}{18}$.
- **Altura de la moda:** $f(c) = \frac{2}{b - a}$.
- **Simétrica:** si $c = (a + b)/2$, media, mediana y moda coinciden.
- **Suma de uniformes:** si $U_1, U_2 \sim U(0, 1)$ son independientes, $U_1 + U_2$ es triangular con $a = 0$, $c = 1$, $b = 2$.
- **Cuantiles explícitos:** se obtienen despejando $F$ en cada tramo, lo que la hace fácil de simular.

:::figura[Tres casos con contexto (simétrica, tarea con retrasos y casi siempre al tope): cada botón carga los tres valores y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: triangular
valores:
  a: 2
  c: 4
  b: 9
casos:
  - nombre: 'Simétrica'
    descripcion: 'Moda en el centro: media, mediana y moda coinciden en 5.'
    valores: {a: 1, c: 5, b: 9}
  - nombre: 'Tarea con retrasos'
    descripcion: 'Moda cerca del mínimo: la media se va a la derecha.'
    valores: {a: 2, c: 4, b: 9}
  - nombre: 'Casi siempre al tope'
    descripcion: 'Moda cerca del máximo: sesgo a la izquierda.'
    valores: {a: 1, c: 8, b: 9}
muestras: false
```
:::

:::figura[Suma de dos uniformes: el histograma forma el triángulo simétrico en [0, 2] con vértice en 1.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-uniformes
valores:
  n: 2
fijos: [n]
```
:::

## Errores comunes

- **Tomar la moda como estimación central.** En la triangular asimétrica la media se aleja de la moda; planear con la moda subestima la duración esperada.
- **Usarla cuando los extremos no son límites reales.** Si un retraso mayor a 9 días es posible, la triangular asigna probabilidad cero a algo que puede ocurrir.
- **Confundir el máximo con un percentil alto.** En la triangular el máximo tiene probabilidad acumulada 1; si el experto da un "peor caso razonable", conviene ampliar $b$.
- **Creer que la altura del vértice es una probabilidad.** Es una densidad, $2/(b - a)$, que puede ser mayor que 1.

:::figura[Moda frente a media: en la tarea, el cuantil 0.5 es 4.82 y la media 5, ambos por encima de la moda 4.]{componente="DistributionExplorer"}
```yaml
distribucion: triangular
valores:
  a: 2
  c: 4
  b: 9
vista: acumulada
probabilidad: 0.5
muestras: false
```
:::

## Conexiones

La triangular es la suma de dos variables de la [[distribucion-uniforme-continua]] y la versión continua de la suma de dos dados de la [[distribucion-uniforme-discreta]]. En gestión de proyectos compite con la [[distribucion-beta]], usada en el método PERT, y se usa como entrada en simulaciones de Monte Carlo cuando solo hay juicio experto. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(x) = \begin{cases} \frac{2(x - a)}{(b - a)(c - a)}, & a \le x \le c \\ \frac{2(b - x)}{(b - a)(b - c)}, & c < x \le b \end{cases}
$$

- $a$: mínimo; $c$: moda; $b$: máximo.
:::

:::formula[Función de distribución]
$$
F(x) = \frac{(x - a)^{2}}{(b - a)(c - a)}\ (a \le x \le c), \qquad F(x) = 1 - \frac{(b - x)^{2}}{(b - a)(b - c)}\ (c < x \le b)
$$

- Cada tramo es una parábola.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{a + b + c}{3}, \qquad \operatorname{Var}(X) = \frac{a^{2} + b^{2} + c^{2} - ab - ac - bc}{18}
$$

- Dependen solo de los tres valores.
:::

:::formula[Suma de dos uniformes]
$$
U_1 + U_2 \sim \operatorname{Tri}(0, 1, 2), \qquad U_i \sim U(0, 1)
$$

- $U_1$, $U_2$: uniformes independientes.
:::
