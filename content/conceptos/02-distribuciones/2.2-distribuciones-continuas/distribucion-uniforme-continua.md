---
id: distribucion-uniforme-continua
titulo: Distribución uniforme continua
titulo_en: Continuous uniform distribution
alias:
  - uniforme continua
  - distribución rectangular
  - U(a, b)
modulo: 2
submodulo: '2.2'
orden: 1
nivel: basico
prerrequisitos:
  - integral-definida-como-area
relaciones:
  - tipo: contrasta
    id: distribucion-uniforme-discreta
etiquetas:
  - distribución continua
  - densidad constante
  - longitud de intervalos
  - redondeo
resumen: >
  Reparte la probabilidad de manera pareja en un intervalo [a, b]: la probabilidad de un subintervalo
  es proporcional a su longitud. Su densidad es constante e igual a 1/(b - a).
formula: 'f(x) = \frac{1}{b - a}, \quad a \le x \le b'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: uniforme
      valores:
        a: 0
        b: 10
      rangos:
        a: [-10, 10]
        b: [-5, 20]
      dominio: [-1, 11]
      casos:
        - nombre: 'Espera de autobús'
          descripcion: 'Pasa cada 10 minutos y se llega sin ver el horario: toda espera entre 0 y 10 es igual de probable, un rectángulo de altura 0.1.'
          valores: {a: 0, b: 10}
        - nombre: 'Error de redondeo'
          descripcion: 'Una báscula redondea al gramo: el error va de -0.5 a 0.5. El intervalo es corto, así que la densidad sube a 1.'
          valores: {a: -0.5, b: 0.5}
        - nombre: 'Ángulo al azar'
          descripcion: 'Una ruleta se detiene en cualquier ángulo entre 0 y 6.28 radianes: rectángulo bajo y ancho, de altura 1/6.28.'
          valores: {a: 0, b: 6.28}
      ejemplo:
        titulo: 'Espera larga'
        contexto: 'El autobús pasa cada 10 minutos y una persona llega a la parada sin consultar el horario.'
        pregunta: '¿Qué probabilidad hay de esperar al menos 7 minutos?'
        valores: {a: 0, b: 10}
        region: derecha
        desde: 7
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: punto-uniforme
        valores:
          a: 0
          b: 10
referencias:
  - clave: blitzstein-hwang
    capitulo: '5'
  - clave: ross-probabilidad
    capitulo: '5'
publicado: true
---

## Intuición

Un autobús pasa cada 10 minutos exactos, y una persona llega a la parada sin consultar el horario. ¿Cuánto esperará? Cualquier momento entre 0 y 10 minutos es igual de plausible: no hay ninguna razón para que la espera de 3 minutos sea más probable que la de 7. La distribución uniforme continua describe esta situación.

Como la espera puede tomar cualquier valor real del intervalo, no tiene sentido preguntar por la probabilidad de esperar exactamente 3.000 minutos: es cero. Lo que sí tiene sentido es preguntar por tramos. La probabilidad de esperar entre 2 y 5 minutos es la fracción del intervalo que ocupa ese tramo, 3 de 10. En la uniforme, probabilidad y longitud son proporcionales.

La densidad es la altura que hace que el área total sea uno: si el intervalo mide 10, la altura es 1/10. Esa altura no es una probabilidad; es probabilidad por unidad de longitud. La uniforme continua aparece en errores de redondeo, en ángulos elegidos al azar y, sobre todo, como materia prima de las simulaciones: casi todos los generadores producen primero números uniformes entre 0 y 1 y luego los transforman.

## Definición

:::definicion[Distribución uniforme continua]
Sean $a < b$ números reales. Una variable aleatoria $X$ tiene **distribución uniforme continua** en $[a, b]$, $X \sim U(a, b)$, si su densidad es
$$
f(x) = \begin{cases} \dfrac{1}{b - a}, & a \le x \le b, \\ 0, & \text{en otro caso.} \end{cases}
$$
:::

Su función de distribución crece en línea recta entre 0 y 1:
$$
F(x) = \begin{cases} 0, & x < a, \\ \dfrac{x - a}{b - a}, & a \le x \le b, \\ 1, & x > b. \end{cases}
$$

:::nota[Qué significa cada símbolo]
- $X$: valor elegido al azar en el intervalo.
- $a$, $b$: extremos del intervalo, con $a < b$.
- $b - a$: longitud del intervalo.
- $f(x)$: densidad, probabilidad por unidad de longitud.
- $F(x)$: probabilidad de obtener un valor menor o igual que $x$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad, que es una línea horizontal a la altura $1/(b - a)$, y sombrea la región elegida en el selector: entre $a$ y $b$, hasta $a$, desde $a$ o las dos colas; el panel da su probabilidad. Los botones de casos cargan situaciones reales y el ejemplo de esta ficha se carga con su propio botón. La pestaña Ver cómo surge deja caer puntos al azar en el segmento cuando se pulsa reproducir.

Al cargar el error de redondeo la altura sube a 1, prueba de que una densidad no es una probabilidad. Con la espera de autobús, la región desde 7 tiene probabilidad 0.3, su longitud entre 10. En la vista de función de distribución la curva es una recta.

## Ejemplo

Una báscula redondea al gramo más cercano, así que el error de redondeo $E$ es uniforme entre $-0.5$ y $0.5$ gramos.

1. Densidad: $f(e) = 1/(0.5 - (-0.5)) = 1$ en el intervalo.
2. Probabilidad de que el error supere 0.3 gramos en valor absoluto: los tramos $[-0.5, -0.3]$ y $[0.3, 0.5]$ miden 0.2 cada uno, así que $P(|E| > 0.3) = 0.4$.
3. Media: $\mathbb{E}[E] = 0$; varianza: $\operatorname{Var}(E) = 1^{2}/12 \approx 0.0833$, con desviación estándar $\approx 0.289$ gramos.
4. Al sumar 100 pesadas, los errores no se cancelan del todo: la varianza total es $100/12 \approx 8.33$, con desviación de unos 2.9 gramos.

:::figura[Error de redondeo uniforme entre -0.5 y 0.5: las colas más allá de ±0.3 suman 0.4, su longitud total por la altura 1. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: -0.5
  b: 0.5
rangos:
  a: [-10, 10]
  b: [-5, 20]
dominio: [-1, 1]
ejemplo:
  titulo: 'Error de redondeo'
  contexto: 'Una báscula redondea al gramo más cercano, así que el error es uniforme entre -0.5 y 0.5 gramos.'
  pregunta: '¿Qué probabilidad hay de que el error supere 0.3 gramos en valor absoluto?'
  valores: {a: -0.5, b: 0.5}
  region: colas
  desde: -0.3
  hasta: 0.3
region: colas
desde: -0.3
hasta: 0.3
muestras: false
```
:::

## Propiedades

- **Probabilidad de un tramo:** para $a \le c \le d \le b$, $P(c \le X \le d) = \dfrac{d - c}{b - a}$.
- **Media y varianza:** $\mathbb{E}[X] = \dfrac{a + b}{2}$ y $\operatorname{Var}(X) = \dfrac{(b - a)^{2}}{12}$.
- **Puntos:** $P(X = x) = 0$ para todo $x$; incluir o no los extremos de un tramo no cambia su probabilidad.
- **Cambio de escala:** si $U \sim U(0, 1)$, entonces $a + (b - a)U \sim U(a, b)$.
- **Transformada integral:** si $X$ es continua con función de distribución $F$, entonces $F(X) \sim U(0, 1)$; al revés, $F^{-1}(U)$ tiene distribución $F$.

:::figura[Tres casos con contexto (espera de autobús, error de redondeo, ángulo al azar): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 10
rangos:
  a: [-10, 10]
  b: [-5, 20]
dominio: [-1, 11]
casos:
  - nombre: 'Espera de autobús'
    descripcion: 'Pasa cada 10 minutos y se llega sin ver el horario: toda espera entre 0 y 10 es igual de probable, un rectángulo de altura 0.1.'
    valores: {a: 0, b: 10}
  - nombre: 'Error de redondeo'
    descripcion: 'Una báscula redondea al gramo: el error va de -0.5 a 0.5. El intervalo es corto, así que la densidad sube a 1.'
    valores: {a: -0.5, b: 0.5}
  - nombre: 'Ángulo al azar'
    descripcion: 'Una ruleta se detiene en cualquier ángulo entre 0 y 6.28 radianes: rectángulo bajo y ancho, de altura 1/6.28.'
    valores: {a: 0, b: 6.28}
```
:::

:::figura[La función de distribución de U(0, 10) es una recta: el cuantil 0.9 es 9 minutos.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 10
rangos:
  b: [1, 20]
dominio: [-1, 11]
vista: acumulada
probabilidad: 0.9
muestras: false
```
:::

:::figura[Cambio de escala: puntos uniformes entre -4 y 2. La forma es la misma que en [0, 1]; solo cambian la posición y la altura, 1/6.]{componente="ContinuousGenesis"}
```yaml
proceso: punto-uniforme
valores:
  a: -4
  b: 2
```
:::

## Errores comunes

- **Pensar que la densidad no puede pasar de 1.** En $U(0, 0.5)$ la densidad vale 2; lo que no puede pasar de 1 es el área.
- **Confundir la densidad con una probabilidad puntual.** $f(x) = 0.1$ no significa $P(X = x) = 0.1$; esa probabilidad es cero.
- **Usar la varianza de la discreta.** La uniforme continua tiene varianza $(b - a)^{2}/12$; la discreta sobre $n$ enteros tiene $(n^{2} - 1)/12$.
- **Creer que la suma de uniformes es uniforme.** La suma de dos $U(0, 1)$ tiene densidad triangular en $[0, 2]$.

:::figura[Densidad mayor que 1: en U(0, 0.5) la altura es 2 y el área sigue siendo 1.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 0.5
dominio: [-0.5, 1]
desde: 0
hasta: 0.5
muestras: false
```
:::

:::figura[La suma de dos uniformes deja de ser uniforme: el histograma de U1 + U2 forma un triángulo con máximo en 1.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-uniformes
valores:
  n: 2
comparar: false
```
:::

## Conexiones

La uniforme continua es la versión continua de la [[distribucion-uniforme-discreta]]: la probabilidad deja de contar puntos y pasa a medir longitudes, es decir, [[integral-definida-como-area|áreas bajo la densidad]]. La suma de dos uniformes da la [[distribucion-triangular]], y la de muchas se parece a la [[distribucion-normal]]. Transformar una uniforme con la inversa de una función de distribución produce cualquier distribución continua; de ahí salen la [[distribucion-exponencial]] y la [[distribucion-de-pareto]] en el generador de números aleatorios.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{1}{b - a}, \qquad a \le x \le b
$$

- $a$, $b$: extremos del intervalo.
- Fuera del intervalo la densidad vale 0.
:::

:::formula[Función de distribución]
$$
F(x) = \frac{x - a}{b - a}, \qquad a \le x \le b
$$

- $F(x)$: fracción del intervalo a la izquierda de $x$.
:::

:::formula[Probabilidad de un tramo]
$$
P(c \le X \le d) = \frac{d - c}{b - a}
$$

- $c$, $d$: extremos del tramo, dentro de $[a, b]$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{a + b}{2}, \qquad \operatorname{Var}(X) = \frac{(b - a)^{2}}{12}
$$

- La media es el punto medio; la varianza depende solo de la longitud.
:::

:::formula[Cambio de escala]
$$
X = a + (b - a)U, \qquad U \sim U(0, 1)
$$

- $U$: uniforme estándar.
:::
