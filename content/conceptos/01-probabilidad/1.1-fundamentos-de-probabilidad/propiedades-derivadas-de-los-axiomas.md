---
id: propiedades-derivadas-de-los-axiomas
titulo: Propiedades derivadas de los axiomas
titulo_en: Basic properties of probability
alias:
  - regla del complemento
  - monotonía de la probabilidad
  - propiedades elementales de la probabilidad
modulo: 1
submodulo: '1.1'
orden: 8
nivel: basico
prerrequisitos:
  - axiomas-de-kolmogorov
  - leyes-de-de-morgan
etiquetas:
  - complemento
  - monotonía
  - diferencia de eventos
  - consecuencias de los axiomas
resumen: >
  De los tres axiomas se deducen las reglas de uso diario: la probabilidad del complemento es 1 menos
  la del evento, el evento imposible tiene probabilidad 0 y un evento contenido en otro no puede ser más probable.
formula: 'P(A^{c}) = 1 - P(A), \qquad A \subseteq B \implies P(A) \le P(B)'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: medida
    experimento: tres-monedas
    eventoA: al-menos-una-cara
    eventos: [al-menos-una-cara, exactamente-dos-caras, todas-iguales, primera-cara]
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.6'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

Los axiomas son pocos a propósito: todo lo demás se deduce de ellos. La deducción más usada es la del complemento. Un evento y su complemento no se traslapan y juntos cubren todo el espacio muestral, así que sus probabilidades deben sumar 1. Si la probabilidad de que un vuelo salga a tiempo es 0.83, la de que se retrase es 0.17, sin necesidad de más información.

Otra consecuencia es la monotonía. Si siempre que ocurre A también ocurre B, entonces B no puede ser menos probable que A: B contiene a A y posiblemente algo más. "Llueve el sábado" no puede ser más probable que "llueve el fin de semana". Aunque parezca obvio, la intuición humana viola esta regla con frecuencia cuando la descripción de A es más detallada y convincente.

Estas propiedades son herramientas de cálculo. Muchas probabilidades difíciles se vuelven sencillas al calcular la del complemento, y la monotonía permite acotar probabilidades cuando no se conocen con exactitud.

## Definición

:::teorema[Propiedades derivadas]
Para eventos $A$ y $B$ de un espacio de probabilidad:

1. **Complemento:** $P(A^{c}) = 1 - P(A)$.
2. **Evento imposible:** $P(\varnothing) = 0$.
3. **Acotación:** $0 \le P(A) \le 1$.
4. **Diferencia:** $P(A \setminus B) = P(A) - P(A \cap B)$.
5. **Monotonía:** si $A \subseteq B$, entonces $P(A) \le P(B)$ y $P(B \setminus A) = P(B) - P(A)$.
:::

:::demostracion
(1) $A$ y $A^{c}$ son excluyentes y $A \cup A^{c} = \Omega$; por los axiomas 2 y 3, $1 = P(A) + P(A^{c})$. (2) Es (1) con $A = \Omega$. (3) Por (1) y el axioma 1, $P(A) = 1 - P(A^{c}) \le 1$. (4) $A$ es la unión disjunta de $A \cap B$ y $A \setminus B$, así que $P(A) = P(A \cap B) + P(A \setminus B)$. (5) Si $A \subseteq B$, entonces $A \cap B = A$ y (4) aplicada a $B$ y $A$ da $P(B \setminus A) = P(B) - P(A) \ge 0$.
:::

:::figura[Monotonía: "el primer dado es 6" (6 casillas) está contenido en "sale al menos un 6" (11 casillas), así que su probabilidad no puede ser mayor: 6/36 frente a 11/36.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: primero-6
eventoB: al-menos-un-seis
operacion: A
operaciones: [A, B, diferencia]
```

:::

:::nota[Qué significa cada símbolo]

- $A$, $B$: eventos; $A^{c}$: complemento de $A$ ("no ocurre $A$").
- $P(\cdot)$: probabilidad.
- $\varnothing$: evento imposible; $\Omega$: espacio muestral.
- $A \setminus B$: diferencia, "ocurre $A$ y no ocurre $B$".
- $A \cap B$: intersección, "ocurren $A$ y $B$".
- $A \subseteq B$: $A$ está contenido en $B$; siempre que ocurre $A$ ocurre $B$.
- $\implies$: "implica".
:::

## Cómo usar la visualización

Las barras muestran la probabilidad de cada uno de los ocho resultados de lanzar tres monedas, cada uno con 1/8. La animación apila primero los resultados del evento elegido en la columna $P(A)$ y después los del complemento en la columna $P(A^{c})$; al terminar, la fórmula confirma que las dos columnas suman 1.

Para "al menos una cara" la columna $P(A)$ recibe siete bloques y la del complemento solo uno, el resultado XXX: por eso $P(A) = 1 - 1/8 = 7/8$. Si se arrastran las barras para simular monedas cargadas, la identidad $P(A) + P(A^{c}) = 1$ se mantiene mientras el total sea 1.

## Ejemplo

Se lanzan cuatro dados. ¿Cuál es la probabilidad de obtener al menos un 6?

1. Contar directamente "al menos un 6" exige separar casos (un 6, dos 6, tres, cuatro). Es más sencillo el complemento: "ningún 6".
2. Hay $6^4 = 1296$ resultados igualmente probables y $5^4 = 625$ no tienen ningún 6.
3. $P(\text{ningún } 6) = 625/1296 \approx 0.482$.
4. Por la regla del complemento, $P(\text{al menos un } 6) = 1 - 0.482 = 0.518$.

Este es el problema que el caballero de Méré planteó a Pascal en el siglo XVII: apostar a al menos un 6 en cuatro tiros es ligeramente favorable.

:::figura[Los 1296 resultados de cuatro dados. El barrido cuenta los 671 que tienen al menos un 6; el complemento, sin ningún 6, es un bloque de 625 resultados que se cuenta con 5 elevado a la 4.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: cuatro-dados
eventoA: al-menos-un-seis
operacion: A
operaciones: [A, complemento]
```

:::

## Propiedades

- **Unión de dos eventos:** combinando la diferencia con la aditividad, $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.
- **Cota de la unión:** como consecuencia, $P(A \cup B) \le P(A) + P(B)$, y en general la probabilidad de una unión no excede la suma de las probabilidades.
- **Complemento de una unión:** por De Morgan, $P(\text{ninguno ocurre}) = P(A^{c} \cap B^{c}) = 1 - P(A \cup B)$.
- **Continuidad:** si $A_1 \subseteq A_2 \subseteq \dots$, entonces $P(\bigcup_n A_n) = \lim_{n \to \infty} P(A_n)$; se deduce de la aditividad numerable.

:::figura[La regla del complemento con un dado cargado: con la cara 6 más pesada, P(sale 4 o menos) se obtiene como 1 menos P(sale 5 o 6), y las dos columnas apiladas siempre completan 1.]{componente="SampleSpaceLab"}

```yaml
modo: medida
experimento: dado
eventoA: a-lo-mas-4
eventos: [a-lo-mas-4, mayor-que-4]
pesos: [0.1, 0.1, 0.15, 0.15, 0.2, 0.3]
```

:::

:::figura[La diferencia de eventos: "la suma es 10 o más" menos "dobles" deja 4 casillas, y P(A menos B) = 6/36 - 2/36 = 4/36.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-mayor-9
eventoB: dobles
operacion: diferencia
operaciones: [diferencia, A, interseccion]
```

:::

## Errores comunes

- **Falacia de la conjunción.** Juzgar "A y B" más probable que "A" porque la descripción conjunta suena más plausible. Como $A \cap B \subseteq A$, siempre $P(A \cap B) \le P(A)$.
- **Restar mal en el complemento.** El complemento de "al menos una cara" es "ninguna cara", no "exactamente una cara".
- **Aplicar $P(B \setminus A) = P(B) - P(A)$ sin que $A \subseteq B$.** En general hay que restar $P(A \cap B)$, no $P(A)$.

:::figura[La intersección siempre está dentro de cada evento: "carta roja y figura" (6 cartas) es menos probable que "figura" (12 cartas), por más detallada que sea su descripción.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: carta
eventoA: figura
eventoB: roja
operacion: interseccion
operaciones: [interseccion, A]
```

:::

:::figura[El complemento de "sale al menos una cara" en tres monedas es "no sale ninguna cara", un solo resultado (XXX), y no "sale exactamente una cara", que tiene tres.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: tres-monedas
eventoA: al-menos-una-cara
eventoB: exactamente-una-cara
operacion: complemento
operaciones: [complemento, B]
```

:::

## Conexiones

Todas estas reglas se deducen de los [[axiomas-de-kolmogorov]] con ayuda de las [[leyes-de-de-morgan]] y de la descomposición disjunta de [[eventos]]. La fórmula de la unión se desarrolla en la [[probabilidad-de-la-union-de-eventos]], y la cota $P(A \cup B) \le P(A) + P(B)$ se generaliza en la desigualdad de Boole. La regla del complemento es el atajo estándar en problemas de "al menos uno", como la paradoja del cumpleaños.

## Formulario

:::formula[Complemento]

$$
P(A^{c}) = 1 - P(A)
$$

- $A^{c}$: el evento "no ocurre $A$".
:::

:::formula[Evento imposible y acotación]

$$
P(\varnothing) = 0, \qquad 0 \le P(A) \le 1
$$

- $\varnothing$: evento que nunca ocurre.
:::

:::formula[Diferencia]

$$
P(A \setminus B) = P(A) - P(A \cap B)
$$

- $A \setminus B$: ocurre $A$ pero no $B$.
- $A \cap B$: ocurren los dos.
:::

:::formula[Monotonía]

$$
A \subseteq B \implies P(A) \le P(B), \quad P(B \setminus A) = P(B) - P(A)
$$

- $A \subseteq B$: todo resultado de $A$ está en $B$.
:::

:::formula[Unión de dos eventos]

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B)
$$

- $A \cup B$: ocurre al menos uno de los dos.
:::
