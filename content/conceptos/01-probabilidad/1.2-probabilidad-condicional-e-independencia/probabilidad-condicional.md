---
id: probabilidad-condicional
titulo: Probabilidad condicional
titulo_en: Conditional probability
alias:
  - probabilidad de A dado B
  - condicionamiento
modulo: 1
submodulo: '1.2'
orden: 1
nivel: basico
prerrequisitos:
  - axiomas-de-kolmogorov
relaciones:
  - tipo: relacionado
    id: espacios-equiprobables
etiquetas:
  - condicionamiento
  - información
  - espacio muestral reducido
  - actualización
resumen: >
  Probabilidad de un evento cuando se sabe que otro ocurrió. Se obtiene restringiendo el espacio
  muestral al evento conocido: P(A | B) = P(A ∩ B) / P(B), siempre que P(B) > 0.
formula: 'P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: condicional
    experimento: dos-dados
    eventoA: suma-mayor-9
    eventoB: primero-6
    eventos: [suma-mayor-9, primero-6, dobles, suma-par, suma-7, al-menos-un-seis, primero-par, segundo-par]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.2'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

Antes de lanzar dos dados, la probabilidad de que la suma sea 10 o más es $6/36 = 1/6$. Si alguien mira el primer dado y avisa "salió 6", la situación cambia: ya no son posibles los 36 resultados, solo los seis que empiezan con 6, y de ellos tres, $(6, 4)$, $(6, 5)$ y $(6, 6)$, dan suma de 10 o más. La probabilidad sube a $3/6 = 1/2$.

Eso es condicionar: incorporar una información y recalcular la probabilidad dentro del mundo que esa información deja abierto. El evento conocido $B$ se convierte en el nuevo espacio muestral, y la probabilidad de $A$ pasa a ser la fracción de $B$ que también está en $A$.

La información puede subir la probabilidad, bajarla o dejarla igual. Saber que salió 6 en el primer dado sube la de una suma alta, baja la de una suma de 4 o menos (a cero) y no cambia la de que el segundo dado sea par. Este último caso, en que la información es irrelevante, es la independencia.

## Definición

:::definicion[Probabilidad condicional]
Si $P(B) > 0$, la **probabilidad condicional de $A$ dado $B$** es
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}.
$$
:::

En un espacio equiprobable la definición se lee como un conteo dentro de $B$: $P(A \mid B) = |A \cap B| / |B|$. Si $P(B) = 0$ la expresión no está definida; el condicionamiento en eventos de probabilidad cero requiere herramientas que aparecen con las distribuciones continuas.

:::figura[Saber que la carta es una figura reduce el espacio a 12 cartas, y 4 de ellas son reyes: P(rey dado figura) = 4/12 = 1/3, mucho más que P(rey) = 4/52.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: carta
eventoA: rey
eventoB: figura
eventos: [rey, figura, corazon, roja, as]
```
:::

:::figura[El condicionamiento como reescalamiento: la parte de B dentro de cada columna se separa del resto y se estira hasta llenar un cuadrado nuevo. Las proporciones dentro de B son las probabilidades condicionales.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: A
    prob: 0.4
  - etiqueta: no A
    prob: 0.6
evento: B
condicionales: [0.5, 0.25]
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos; $B$ es la información que se sabe que ocurrió.
- $P(A \mid B)$: probabilidad de $A$ dado $B$; la barra vertical se lee "dado".
- $A \cap B$: ocurren $A$ y $B$ a la vez.
- $P(B) > 0$: condición para que la división tenga sentido.
- $|A \cap B|$, $|B|$: número de resultados de cada evento en un espacio equiprobable.
:::

## Cómo usar la visualización

La rejilla muestra los 36 resultados de dos dados. Las casillas azules forman A y las rayadas forman B. La animación tiene tres pasos: primero se muestra $P(A)$ sobre todo el espacio; después se descartan los resultados fuera de B, que se atenúan; por último se cuentan los resultados de A que quedan dentro de B y se divide entre el tamaño de B.

Con A = "la suma es 10 o más" y B = "el primer dado es 6", la probabilidad pasa de $6/36$ a $3/6$. Al cambiar B por "dobles" queda $2/6$. El selector "Se sabe que ocurrió" invierte los papeles y calcula $P(B \mid A)$, que en general es distinta: con los valores iniciales, $P(\text{primero } 6 \mid \text{suma} \ge 10) = 3/6$ también, pero con A = "dobles" y B = "suma par" las dos condicionales son $1/3$ y $1$.

## Ejemplo

Una tienda en línea analiza a 500 clientes: 300 pagan con tarjeta ($T$), 200 compraron más de una vez ($R$) y 150 cumplen ambas cosas.

1. $P(R) = 200/500 = 0.40$.
2. $P(T) = 300/500 = 0.60$ y $P(R \cap T) = 150/500 = 0.30$.
3. $P(R \mid T) = 0.30/0.60 = 0.50$: entre quienes pagan con tarjeta, la mitad repite compra.
4. $P(T \mid R) = 0.30/0.40 = 0.75$: entre quienes repiten, tres de cada cuatro pagan con tarjeta.
5. $P(R \mid T^{c}) = (200 - 150)/(500 - 300) = 50/200 = 0.25$: sin tarjeta, solo uno de cada cuatro repite.

Saber que un cliente paga con tarjeta sube la probabilidad de que repita de 0.40 a 0.50.

:::figura[Los 500 clientes del ejemplo. Las consultas muestran T (300), los que están en T y en R (150) y los que repiten sin tarjeta (50): P(R dado T) = 150/300 y P(R dado no T) = 50/200.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [T, R]
universo: 500 clientes
conteos:
  T: 150
  R: 50
  TR: 150
  ninguno: 150
consultas:
  - nombre: Pagan con tarjeta (T)
    regiones: [T, TR]
  - nombre: T y R
    regiones: [TR]
  - nombre: Sin tarjeta
    regiones: [R, ninguno]
  - nombre: R sin tarjeta
    regiones: [R]
```
:::

## Propiedades

- **Es una probabilidad:** para $B$ fijo con $P(B) > 0$, la función $A \mapsto P(A \mid B)$ cumple los tres axiomas. En particular $P(A^{c} \mid B) = 1 - P(A \mid B)$ y $P(B \mid B) = 1$.
- **Regla del producto:** despejando, $P(A \cap B) = P(B)\,P(A \mid B) = P(A)\,P(B \mid A)$.
- **No es simétrica:** en general $P(A \mid B) \neq P(B \mid A)$; las dos se relacionan por el teorema de Bayes, $P(A \mid B) = P(B \mid A)\,P(A)/P(B)$.
- **Inclusión:** si $B \subseteq A$, entonces $P(A \mid B) = 1$; si $A \cap B = \varnothing$, entonces $P(A \mid B) = 0$.

:::figura[Dos condicionales muy distintas: P(dobles dado suma par) = 6/18 = 1/3, pero P(suma par dado dobles) = 6/6 = 1, porque todos los dobles tienen suma par. El selector cambia qué evento se da por conocido.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: dobles
eventoB: suma-par
condicion: B
eventos: [dobles, suma-par]
```
:::

:::figura[Cuando B excluye a A la condicional es 0: si el primer dado es 6, la suma no puede ser 4 o menos.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: suma-menor-5
eventoB: primero-6
eventos: [suma-menor-5, primero-6]
```
:::

## Errores comunes

- **Confundir $P(A \mid B)$ con $P(B \mid A)$.** La probabilidad de tener fiebre dado que se tiene gripe es alta; la de tener gripe dado que se tiene fiebre puede ser baja, porque muchas otras causas producen fiebre.
- **Dividir entre el total en lugar de entre $P(B)$.** $P(A \cap B)$ es la probabilidad conjunta, no la condicional; la condicional se mide dentro de $B$.
- **Creer que condicionar siempre cambia la probabilidad.** Si $A$ y $B$ son independientes, $P(A \mid B) = P(A)$.
- **Condicionar en un evento de probabilidad 0** con la fórmula elemental, que no está definida en ese caso.

:::figura[Condicionar no siempre cambia nada: saber que el segundo dado es par deja la probabilidad de que el primero sea par en 1/2, porque los dados no se influyen.]{componente="SampleSpaceLab"}
```yaml
modo: condicional
experimento: dos-dados
eventoA: primero-par
eventoB: segundo-par
eventos: [primero-par, segundo-par]
```
:::

:::figura[Error de denominador: P(rey y figura) = 4/52 es la probabilidad conjunta; la condicional P(rey dado figura) divide entre las 12 figuras, no entre las 52 cartas.]{componente="SampleSpaceLab"}
```yaml
modo: eventos
experimento: carta
eventoA: rey
eventoB: figura
operacion: interseccion
operaciones: [interseccion, B]
```
:::

## Conexiones

La probabilidad condicional se define a partir de los [[axiomas-de-kolmogorov]] y, en [[espacios-equiprobables]], se reduce a contar dentro del evento conocido. De ella salen la [[regla-del-producto]], la [[regla-de-la-cadena-de-probabilidad]], la [[ley-de-probabilidad-total]] y el [[teorema-de-bayes]], que relaciona $P(A \mid B)$ con $P(B \mid A)$. Cuando la información no cambia la probabilidad, los eventos son independientes ([[independencia-de-eventos]]).

## Formulario

:::formula[Probabilidad condicional]
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0
$$

- $P(A \mid B)$: probabilidad de $A$ sabiendo que ocurrió $B$.
- $P(A \cap B)$: probabilidad de que ocurran los dos.
- $P(B)$: probabilidad del evento conocido.
:::

:::formula[En un espacio equiprobable]
$$
P(A \mid B) = \frac{|A \cap B|}{|B|}
$$

- $|A \cap B|$: resultados de $B$ que también están en $A$.
- $|B|$: resultados de $B$, el nuevo espacio muestral.
:::

:::formula[Complemento condicional]
$$
P(A^{c} \mid B) = 1 - P(A \mid B)
$$

- $A^{c}$: el evento "no ocurre $A$".
:::

:::formula[Relación entre las dos condicionales]
$$
P(A \mid B)\,P(B) = P(B \mid A)\,P(A)
$$

- Ambos lados son iguales a $P(A \cap B)$.
:::
