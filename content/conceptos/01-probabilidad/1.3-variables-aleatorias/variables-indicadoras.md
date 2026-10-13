---
id: variables-indicadoras
titulo: Variables indicadoras
titulo_en: Indicator random variables
alias:
  - indicadora de un evento
  - variable de Bernoulli de un evento
  - variable dicotómica
modulo: 1
submodulo: '1.3'
orden: 9
nivel: basico
prerrequisitos:
  - variable-aleatoria
  - funcion-indicadora-y-funcion-escalon
relaciones:
  - tipo: relacionado
    id: distribucion-de-bernoulli
  - tipo: relacionado
    id: linealidad-de-la-esperanza
etiquetas:
  - indicadora
  - evento como número
  - conteo
  - método de indicadoras
resumen: >
  La variable indicadora de un evento vale 1 si el evento ocurre y 0 si no. Su esperanza es la
  probabilidad del evento, y escribir un conteo como suma de indicadoras permite calcular su media
  sin conocer su distribución.
formula: '\mathbf{1}_A(\omega) = \begin{cases} 1 & \omega \in A \\ 0 & \omega \notin A \end{cases}, \qquad \mathbb{E}[\mathbf{1}_A] = P(A)'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: esperanza
    experimento: dos-dados
    variable: indicadora-suma-7
    variables: [indicadora-suma-7, indicadora-dobles]
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.4'
  - clave: ross-probabilidad
    capitulo: '7.2'
publicado: true
---

## Intuición

Una variable indicadora es la manera más simple de convertir un evento en un número: vale 1 si el evento ocurre y 0 si no. Parece un recurso trivial, pero es una de las herramientas más útiles de la probabilidad.

La razón es que muchos conteos se escriben como sumas de indicadoras. El número de caras en 10 lanzamientos es la suma de 10 indicadoras, una por lanzamiento. El número de personas que reciben su propio sombrero en un guardarropa revuelto es la suma de una indicadora por persona. La distribución del conteo puede ser complicadísima, pero su media es fácil: la media de una suma es la suma de las medias, y la media de cada indicadora es solo la probabilidad de su evento.

## Definición

:::definicion[Variable indicadora]
Sea $A$ un evento. La **variable indicadora** de $A$ es
$$
\mathbf{1}_A(\omega) = \begin{cases} 1 & \text{si } \omega \in A, \\ 0 & \text{si } \omega \notin A. \end{cases}
$$
Es una variable aleatoria con distribución de Bernoulli de parámetro $P(A)$, y
$$
\mathbb{E}[\mathbf{1}_A] = 1 \cdot P(A) + 0 \cdot P(A^{c}) = P(A).
$$
:::

También se escribe $I_A$ o $\mathbf{1}\{A\}$. El paso de eventos a indicadoras convierte las operaciones entre conjuntos en operaciones entre números.

:::figura[La indicadora de corazones en una baraja: las 13 cartas de corazones van al 1 y las otras 39 al 0, así que la indicadora vale 1 con probabilidad 1/4.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: carta
variable: indicadora-corazon
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos.
- $\mathbf{1}_A$: indicadora de $A$; también $I_A$.
- $\omega$: un resultado del experimento.
- $A^{c}$: complemento de $A$.
- $N$: número de personas que recuperan su sombrero en el ejemplo.
- $I_k$: indicadora de que la persona $k$ recibe su propio sombrero.
- $n$: número de personas.
:::

## Cómo usar la visualización

La gráfica muestra la indicadora de que la suma de dos dados sea 7: una barra de 30/36 en el 0 y otra de 6/36 en el 1. El triángulo marca el punto donde la regla queda en equilibrio, la esperanza, que es exactamente 1/6, la probabilidad del evento. La animación suma la contribución de cada barra al encabezado: la barra del 0 no aporta nada y la del 1 aporta su probabilidad.

El selector cambia a la indicadora de dobles, cuya esperanza también es 1/6: dos eventos distintos con la misma probabilidad dan indicadoras con la misma distribución.

## Ejemplo

En un guardarropa, $n$ personas dejan sus sombreros y se los devuelven al azar, todos los órdenes igualmente probables. Sea $N$ el número de personas que reciben su propio sombrero.

1. Se escribe $N = I_1 + I_2 + \dots + I_n$, donde $I_k$ indica que la persona $k$ recibe el suyo.
2. Cada persona recibe el suyo con probabilidad $1/n$, así que $\mathbb{E}[I_k] = 1/n$.
3. Por linealidad, $\mathbb{E}[N] = n \cdot \tfrac{1}{n} = 1$, sin importar $n$.

Las indicadoras no son independientes (si $n - 1$ personas recibieron el suyo, la última también), pero la linealidad no lo necesita. Para $n = 4$ la distribución de $N$ es $9/24$, $8/24$, $6/24$, $0$ y $1/24$ para 0, 1, 2, 3 y 4 aciertos, y su media es 1.

:::figura[El guardarropa con 4 personas: ninguna o una sola persona recupera su sombrero en la mayoría de los casos, nunca exactamente 3, y la media es 1.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
valores: [0, 1, 2, 3, 4]
probabilidades: [9, 8, 6, 0, 1]
nombre: el número de personas con su sombrero
simbolo: N
```
:::

## Propiedades

- **Esperanza y varianza:** $\mathbb{E}[\mathbf{1}_A] = P(A)$ y $\operatorname{Var}(\mathbf{1}_A) = P(A)\,(1 - P(A))$.
- **Potencias:** $\mathbf{1}_A^2 = \mathbf{1}_A$, porque $0^2 = 0$ y $1^2 = 1$.
- **Operaciones de conjuntos:** $\mathbf{1}_{A \cap B} = \mathbf{1}_A \mathbf{1}_B$, $\mathbf{1}_{A^{c}} = 1 - \mathbf{1}_A$ y $\mathbf{1}_{A \cup B} = \mathbf{1}_A + \mathbf{1}_B - \mathbf{1}_A \mathbf{1}_B$. Tomando esperanzas se recupera la fórmula de la unión.
- **Eventos excluyentes:** si $A \cap B = \varnothing$, entonces $\mathbf{1}_{A \cup B} = \mathbf{1}_A + \mathbf{1}_B$.

:::figura[Suma de dos indicadoras de eventos excluyentes, dobles y suma 7: sus esperanzas, 1/6 cada una, suman 1/3, la probabilidad de que ocurra alguno de los dos.]{componente="RandomVariableLab"}
```yaml
modo: linealidad
experimento: dos-dados
variable: indicadora-dobles
segunda: indicadora-suma-7
```
:::

:::figura[La varianza de la indicadora de cara par: con $P(A) = 1/2$ vale $1/2 \cdot 1/2 = 0.25$, el máximo posible para una indicadora.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: dado
variable: indicadora-par
a: 1
b: 0
```
:::

## Errores comunes

- **Creer que se necesita independencia para sumar medias.** La linealidad de la esperanza vale siempre; la independencia solo importa para la varianza de la suma.
- **Tomar la suma de indicadoras como indicadora.** Si los eventos no son excluyentes, la suma puede valer 2 o más: es un conteo, no una indicadora.
- **Confundir la indicadora con el evento.** $\mathbf{1}_A$ es un número aleatorio; $A$ es un conjunto. Se escribe $\mathbb{E}[\mathbf{1}_A] = P(A)$, no $\mathbb{E}[A]$.

:::figura[El número de seises en dos dados es la suma de dos indicadoras que pueden valer 1 a la vez: toma los valores 0, 1 y 2, y su media es $2 \cdot 1/6 = 1/3$.]{componente="RandomVariableLab"}
```yaml
modo: mapeo
experimento: dos-dados
variable: numero-de-seises
```
:::

## Conexiones

Una indicadora es la [[funcion-indicadora-y-funcion-escalon]] aplicada a un evento, y por eso es una [[variable-aleatoria]] con [[distribucion-de-bernoulli]]. Su media es la probabilidad del evento, lo que conecta la [[esperanza-matematica]] con la probabilidad. Junto con la [[linealidad-de-la-esperanza]] forman el método de indicadoras, que resuelve problemas como el [[problema-del-coleccionista-de-cupones]] o el número esperado de coincidencias en la [[paradoja-del-cumpleanos]]. La [[distribucion-binomial]] es la distribución de una suma de indicadoras independientes con la misma probabilidad.

## Formulario

:::formula[Definición]
$$
\mathbf{1}_A(\omega) = \begin{cases} 1 & \omega \in A \\ 0 & \omega \notin A \end{cases}
$$

- Convierte el evento $A$ en un número.
:::

:::formula[Momentos]
$$
\mathbb{E}[\mathbf{1}_A] = P(A), \qquad \operatorname{Var}(\mathbf{1}_A) = P(A)\,(1 - P(A))
$$

- Es una Bernoulli con parámetro $P(A)$.
:::

:::formula[Álgebra de indicadoras]
$$
\mathbf{1}_{A \cap B} = \mathbf{1}_A \mathbf{1}_B, \qquad \mathbf{1}_{A^{c}} = 1 - \mathbf{1}_A
$$

- Intersección como producto, complemento como resta.
:::

:::formula[Método de indicadoras]
$$
N = \sum_{k=1}^{n} \mathbf{1}_{A_k} \quad \Rightarrow \quad \mathbb{E}[N] = \sum_{k=1}^{n} P(A_k)
$$

- Vale aunque los eventos sean dependientes.
:::
