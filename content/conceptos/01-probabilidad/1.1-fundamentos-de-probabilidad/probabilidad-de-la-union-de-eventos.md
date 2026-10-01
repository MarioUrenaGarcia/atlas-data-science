---
id: probabilidad-de-la-union-de-eventos
titulo: Probabilidad de la unión de eventos
titulo_en: Probability of a union of events
alias:
  - regla de la suma
  - regla de la adición
  - fórmula de inclusión y exclusión para probabilidades
modulo: 1
submodulo: '1.1'
orden: 9
nivel: basico
prerrequisitos:
  - propiedades-derivadas-de-los-axiomas
  - principio-de-inclusion-y-exclusion
etiquetas:
  - unión
  - inclusión y exclusión
  - regla de la suma
  - eventos que se traslapan
resumen: >
  La probabilidad de que ocurra A o B es la suma de sus probabilidades menos la de que ocurran ambos,
  porque la intersección quedaría contada dos veces. Con más eventos se alternan sumas y restas.
formula: 'P(A \cup B) = P(A) + P(B) - P(A \cap B)'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: union
    experimento: dos-dados
    eventoA: primero-par
    eventoB: suma-mayor-9
    eventos: [primero-par, suma-mayor-9, dobles, al-menos-un-seis, suma-7, suma-par]
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.6'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

En una ciudad, 40 % de los adultos lee el periódico y 30 % escucha noticias en la radio. ¿Qué proporción se informa por alguno de los dos medios? Sumar $40 + 30 = 70$ % supone que nadie usa los dos. Si 12 % usa ambos, esas personas están incluidas tanto en el 40 % como en el 30 %: la suma las cuenta dos veces. Para corregir se resta la intersección una vez, y la respuesta es $40 + 30 - 12 = 58$ %.

Esta es la regla de la suma para eventos que se traslapan. Es la versión probabilística del principio de inclusión y exclusión: cada resultado de la unión debe contribuir exactamente una vez. Cuando los eventos son excluyentes la intersección es vacía y basta sumar, que es lo que dice el tercer axioma.

Con tres o más eventos el patrón se repite: se suman las probabilidades individuales, se restan las de cada par, se suman las de cada trío y así sucesivamente, alternando signos, hasta que cada resultado queda contado una sola vez.

## Definición

:::teorema[Regla de la suma]
Para dos eventos cualesquiera,

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B).
$$

Para eventos $A_1, \dots, A_n$ (inclusión y exclusión),

$$
P\Big(\bigcup_{i=1}^{n} A_i\Big) = \sum_{i} P(A_i) - \sum_{i < j} P(A_i \cap A_j) + \sum_{i < j < k} P(A_i \cap A_j \cap A_k) - \dots + (-1)^{n+1} P(A_1 \cap \dots \cap A_n).
$$

:::

:::demostracion
$A \cup B$ es la unión disjunta de $A$ y $B \setminus A$, así que $P(A \cup B) = P(A) + P(B \setminus A)$. Además $B$ es la unión disjunta de $A \cap B$ y $B \setminus A$, de donde $P(B \setminus A) = P(B) - P(A \cap B)$. Sustituyendo se obtiene la fórmula. El caso general se demuestra por inducción sobre $n$.
:::

:::figura[Tres eventos en una encuesta a 100 estudiantes: M (cursa matemáticas), F (física) y Q (química). Las consultas sombrean la unión y cada intersección; la fórmula de tres eventos se obtiene sumando las regiones sin repetirlas.]{componente="VennSets"}

```yaml
modo: conteos
etiquetas: [M, F, Q]
universo: Estudiantes encuestados
conteos:
  M: 20
  F: 10
  Q: 12
  MF: 8
  MQ: 6
  FQ: 4
  MFQ: 5
  ninguno: 35
consultas:
  - nombre: M o F o Q
    regiones: [M, F, Q, MF, MQ, FQ, MFQ]
  - nombre: M y F
    regiones: [MF, MFQ]
  - nombre: M y Q
    regiones: [MQ, MFQ]
  - nombre: F y Q
    regiones: [FQ, MFQ]
  - nombre: Los tres
    regiones: [MFQ]
```

:::

:::nota[Qué significa cada símbolo]

- $A$, $B$, $A_1, \dots, A_n$: eventos; $n$: cuántos son.
- $A \cup B$: ocurre al menos uno de los dos; $\bigcup_{i=1}^{n} A_i$: ocurre al menos uno de los $n$.
- $A \cap B$: ocurren los dos a la vez.
- $\sum_{i<j}$: suma sobre todos los pares de índices distintos; $\sum_{i<j<k}$, sobre todos los tríos.
- $(-1)^{n+1}$: signo del último término, positivo si $n$ es impar.
- $B \setminus A$: ocurre $B$ y no ocurre $A$.
:::

## Cómo usar la visualización

La rejilla contiene los 36 resultados de lanzar dos dados. La animación construye la regla en tres pasos: primero suma los resultados de A, luego los de B, y los resultados comunes quedan marcados con un 2 porque se contaron dos veces; el tercer paso resta la intersección y todos vuelven a 1. La fórmula de arriba muestra en cada paso las fracciones con los conteos actuales.

Con A = "el primer dado es par" y B = "la suma es 10 o más", $P(A) + P(B) = 24/36$, pero cuatro casillas se cuentan dos veces y la unión tiene $20/36$. Al elegir B = "la suma es 7" la intersección tiene 3 resultados. Con A = "dobles" y B = "la suma es par", A está contenido en B y la unión es simplemente B.

## Ejemplo

En una ciudad, 40 % de los adultos lee el periódico, 30 % escucha noticias en la radio y 12 % hace ambas cosas. Sean $L$ = "lee el periódico" y $R$ = "escucha la radio", con $P(L) = 0.40$, $P(R) = 0.30$ y $P(L \cap R) = 0.12$.

1. $P(L \cup R) = 0.40 + 0.30 - 0.12 = 0.58$.
2. Solo periódico: $P(L \setminus R) = 0.40 - 0.12 = 0.28$. Solo radio: $0.30 - 0.12 = 0.18$.
3. Ninguno de los dos: $1 - 0.58 = 0.42$.
4. Comprobación: $0.28 + 0.18 + 0.12 + 0.42 = 1$.

:::figura[Los datos del ejemplo por cada 100 adultos: 28 solo leen el periódico, 18 solo escuchan la radio, 12 hacen ambas cosas y 42 ninguna. La unión suma 58.]{componente="VennSets"}

```yaml
modo: conteos
etiquetas: [L, R]
universo: 100 adultos
conteos:
  L: 28
  R: 18
  LR: 12
  ninguno: 42
consultas:
  - nombre: L o R
    regiones: [L, R, LR]
  - nombre: Solo L
    regiones: [L]
  - nombre: L y R
    regiones: [LR]
  - nombre: Ninguno
    regiones: [ninguno]
```

:::

Con tres eventos se procede igual. Para los 100 estudiantes de la figura de la definición: $P(M) = 0.39$, $P(F) = 0.27$, $P(Q) = 0.27$, $P(M \cap F) = 0.13$, $P(M \cap Q) = 0.11$, $P(F \cap Q) = 0.09$ y $P(M \cap F \cap Q) = 0.05$, de modo que $P(M \cup F \cup Q) = 0.39 + 0.27 + 0.27 - 0.13 - 0.11 - 0.09 + 0.05 = 0.65$.

## Propiedades

- **Eventos excluyentes:** si $A \cap B = \varnothing$, la regla se reduce a $P(A \cup B) = P(A) + P(B)$.
- **Desigualdad de Boole:** como $P(A \cap B) \ge 0$, siempre $P(A \cup B) \le P(A) + P(B)$; en general, $P(\bigcup_i A_i) \le \sum_i P(A_i)$.
- **Cota inferior:** $P(A \cup B) \ge \max\{P(A), P(B)\}$, por monotonía.
- **Desigualdades de Bonferroni:** truncar la fórmula de inclusión y exclusión después de un término positivo da una cota superior, y después de uno negativo, una cota inferior.
- **Por complemento:** $P(A \cup B) = 1 - P(A^{c} \cap B^{c})$, útil cuando "ninguno ocurre" es más fácil de calcular.

:::figura[Eventos excluyentes: "la carta es un as" y "la carta es una figura" no comparten cartas. El paso de restar no quita nada y P(A o B) = 4/52 + 12/52 = 16/52.]{componente="SampleSpaceLab"}

```yaml
modo: union
experimento: carta
eventoA: as
eventoB: figura
eventos: [as, figura, rey, corazon]
```

:::

:::figura[Desigualdad de Boole con mucho traslape: "primer dado par" y "segundo dado par" suman 36/36, pero la unión es 27/36 porque 9 resultados se cuentan dos veces.]{componente="SampleSpaceLab"}

```yaml
modo: union
experimento: dos-dados
eventoA: primero-par
eventoB: segundo-par
eventos: [primero-par, segundo-par, suma-par]
```

:::

## Errores comunes

- **Sumar sin restar la intersección.** Solo es correcto para eventos excluyentes.
- **Obtener probabilidades mayores que 1.** Una suma de probabilidades que excede 1 es señal inequívoca de traslape: con cuatro monedas, "al menos una cara" (15/16) y "más caras que cruces" (5/16) suman 20/16.
- **Usar $P(A \cap B) = P(A)P(B)$ sin justificación.** Esa igualdad solo vale para eventos independientes; en general la intersección se obtiene de los datos del problema.
- **Con tres eventos, detenerse en los pares.** Al restar las intersecciones de dos, los resultados comunes a los tres se quedan sin contar y hay que sumarlos de nuevo.

:::figura[Una suma mayor que 1: "al menos una cara" y "más caras que cruces" en cuatro monedas. El paso 2 marca con un 2 los cinco resultados de B, todos contenidos en A; al restar la intersección la unión vuelve a ser 15/16.]{componente="SampleSpaceLab"}

```yaml
modo: union
experimento: cuatro-monedas
eventoA: al-menos-una-cara
eventoB: mas-caras
eventos: [al-menos-una-cara, mas-caras, primera-cara]
```

:::

## Conexiones

La regla de la suma es la versión probabilística del [[principio-de-inclusion-y-exclusion]] y se deduce de las [[propiedades-derivadas-de-los-axiomas]]. Para eventos excluyentes coincide con el tercero de los [[axiomas-de-kolmogorov]]. La desigualdad de Boole que se desprende de ella es la base de las correcciones por comparaciones múltiples, y la probabilidad de la intersección que aparece en la fórmula se estudia con la probabilidad condicional y la regla del producto.

## Formulario

:::formula[Unión de dos eventos]

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B)
$$

- $P(A \cap B)$: probabilidad de que ocurran los dos, que la suma contaría dos veces.
:::

:::formula[Unión de tres eventos]

$$
P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)
$$

- $A$, $B$, $C$: eventos; los pares se restan y la triple intersección se vuelve a sumar.
:::

:::formula[Inclusión y exclusión]

$$
P\Big(\bigcup_{i=1}^{n} A_i\Big) = \sum_{k=1}^{n} (-1)^{k+1} \sum_{i_1 < \dots < i_k} P(A_{i_1} \cap \dots \cap A_{i_k})
$$

- $k$: número de eventos en cada intersección.
- $i_1 < \dots < i_k$: índices distintos, cada combinación contada una vez.
- $(-1)^{k+1}$: signo, positivo para $k$ impar y negativo para $k$ par.
:::

:::formula[Desigualdad de Boole]

$$
P\Big(\bigcup_{i=1}^{n} A_i\Big) \le \sum_{i=1}^{n} P(A_i)
$$

- La igualdad se cumple cuando los eventos son excluyentes.
:::
