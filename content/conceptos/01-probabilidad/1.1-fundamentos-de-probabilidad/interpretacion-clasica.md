---
id: interpretacion-clasica
titulo: Interpretación clásica (Laplace)
titulo_en: Classical interpretation of probability
alias:
  - regla de Laplace
  - probabilidad clásica
  - casos favorables entre casos posibles
modulo: 1
submodulo: '1.1'
orden: 4
nivel: basico
prerrequisitos:
  - eventos
  - principio-del-producto
relaciones:
  - tipo: contrasta
    id: interpretacion-frecuentista
  - tipo: relacionado
    id: espacios-equiprobables
etiquetas:
  - Laplace
  - casos favorables
  - simetría
  - conteo
resumen: >
  Si un experimento tiene un número finito de resultados igualmente posibles, la probabilidad de un
  evento es el número de casos favorables dividido entre el número de casos posibles.
formula: 'P(A) = \frac{|A|}{|\Omega|} = \frac{\text{casos favorables}}{\text{casos posibles}}'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: eventos
    experimento: carta
    eventoA: figura
    eventos: [figura, as, corazon, roja, numero-par]
    operaciones: [A]
referencias:
  - clave: ross-probabilidad
    capitulo: '2'
  - clave: blitzstein-hwang
    capitulo: '1.3'
publicado: true
---

## Intuición

Una baraja bien revuelta no tiene preferencias: ninguna carta tiene más derecho que otra a salir primero. Si hay 52 cartas y 12 son figuras, la única asignación razonable da a "sacar una figura" una probabilidad de 12 entre 52. Esta es la idea que Pierre Simon Laplace formuló a principios del siglo XIX: cuando no hay razón para preferir un resultado sobre otro, la probabilidad de un evento es la proporción de resultados que lo favorecen.

La interpretación clásica funciona bien en juegos de azar, loterías y muestreos al azar, donde la simetría física del mecanismo (un dado balanceado, una urna mezclada) justifica que todos los resultados sean igualmente posibles. Convierte la probabilidad en un problema de conteo.

Su límite es precisamente esa suposición. No sirve si los resultados no son simétricos (un dado cargado, la probabilidad de lluvia) ni si hay infinitos resultados. Además, la definición es circular en un sentido: "igualmente posibles" ya es una afirmación sobre probabilidades.

## Definición

:::definicion[Probabilidad clásica]
Sea $\Omega$ un espacio muestral finito cuyos resultados son igualmente posibles. La probabilidad de un evento $A \subseteq \Omega$ es

$$
P(A) = \frac{|A|}{|\Omega|}.
$$

:::

Condiciones de validez: $\Omega$ debe ser finito y no vacío, y la simetría del experimento debe justificar que todos sus resultados tienen la misma probabilidad. Con esas condiciones, la regla satisface los [[axiomas-de-kolmogorov]].

:::figura[En un dado equilibrado, "sale un número primo" tiene 3 casos favorables (2, 3 y 5) entre 6 posibles, así que su probabilidad clásica es 3/6 = 1/2.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dado
eventoA: primo
eventos: [primo, par, mayor-que-4, seis]
operaciones: [A]
```

:::

:::nota[Qué significa cada símbolo]

- $P(A)$: probabilidad del evento $A$.
- $A$: evento de interés, un subconjunto de $\Omega$.
- $|A|$: número de resultados de $A$ (casos favorables).
- $\Omega$: espacio muestral; $|\Omega|$: número total de resultados (casos posibles).
  :::

## Cómo usar la visualización

La rejilla muestra las 52 cartas de una baraja inglesa, con el palo en las filas y el valor en las columnas. Al reproducir, el barrido revisa las cartas una por una y cuenta las que pertenecen al evento elegido; al terminar, la fórmula de arriba muestra casos favorables entre casos posibles.

Para "la carta es una figura" el conteo llega a 12 y la probabilidad a $12/52 \approx 0.231$. Al cambiar a "la carta es un as" la cuenta baja a 4, una columna. "La carta es roja" cubre dos filas completas y da exactamente 1/2. La forma del evento en la rejilla ayuda a contar: las filas y columnas completas se cuentan multiplicando.

## Ejemplo

Se lanzan dos dados equilibrados. ¿Cuál es la probabilidad de que la suma sea 8?

1. Casos posibles: los pares ordenados $(i, j)$ con $i, j \in \{1, \dots, 6\}$, en total $6 \times 6 = 36$, todos igualmente posibles por la simetría de los dados.
2. Casos favorables: $(2, 6)$, $(3, 5)$, $(4, 4)$, $(5, 3)$, $(6, 2)$, es decir 5.
3. Resultado: $P(\text{suma} = 8) = 5/36 \approx 0.139$.

Para comparar, la suma 7 tiene 6 casos favorables y probabilidad $6/36 = 1/6$; es la suma más probable.

:::figura[Los 5 pares con suma 8 forman un tramo de antidiagonal en la rejilla de 36 resultados. Al cambiar a "la suma es 7" se obtiene la antidiagonal completa, con 6 casos.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-8
eventos: [suma-8, suma-7, suma-2, suma-mayor-9]
operaciones: [A]
```

:::

## Propiedades

- **Rango:** como $0 \le |A| \le |\Omega|$, se cumple $0 \le P(A) \le 1$, con $P(\varnothing) = 0$ y $P(\Omega) = 1$.
- **Aditividad:** si $A$ y $B$ son excluyentes, $|A \cup B| = |A| + |B|$, así que $P(A \cup B) = P(A) + P(B)$.
- **Complemento:** $P(A^{c}) = (|\Omega| - |A|)/|\Omega| = 1 - P(A)$. Suele ser más fácil contar el complemento.
- **Concordancia con la frecuencia:** cuando la simetría es real, la frecuencia relativa observada al repetir el experimento se acerca a $|A|/|\Omega|$.

:::figura[Contar el complemento: con cuatro monedas, "no sale ninguna cara" tiene un solo caso, así que "sale al menos una cara" tiene probabilidad 1 - 1/16 = 15/16.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: cuatro-monedas
eventoA: al-menos-una-cara
eventoB: ninguna-cara
operacion: A
operaciones: [A, B]
```

:::

:::figura[La probabilidad clásica 5/36 de sumar 8 coincide con la proporción observada al lanzar dos dados muchas veces; la banda indica cuánto se aleja normalmente la proporción según el número de lanzamientos.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-8
eventos: [suma-8]
ensayos: 3000
banda: true
```

:::

## Errores comunes

- **Aplicar la regla a resultados que no son igualmente posibles.** Las sumas de dos dados son 11 valores, pero no son equiprobables: $P(\text{suma} = 2) = 1/36$ y $P(\text{suma} = 7) = 6/36$, no $1/11$ cada una.
- **Error de D'Alembert.** Al lanzar dos monedas, "al menos una cara" no tiene probabilidad $2/3$ por haber tres casos (dos caras, una cara, ninguna). Con resultados ordenados hay cuatro casos equiprobables y tres favorables: $3/4$.
- **Contar favorables y posibles con criterios distintos.** Si los casos posibles se cuentan como pares ordenados, los favorables también deben contarse ordenados.

:::figura[Las sumas no son equiprobables: "la suma es 2" solo tiene la casilla (1, 1), mientras que la suma 7 tiene 6 casillas.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-2
eventoB: suma-7
operacion: A
operaciones: [A, B]
```

:::

:::figura[El error de D'Alembert: con dos monedas hay 4 resultados ordenados, y "al menos una cara" ocupa 3 de ellos, no 2 de 3.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-monedas
eventoA: al-menos-una-cara
operaciones: [A]
```

:::

## Conexiones

La regla de Laplace es el caso particular de los [[axiomas-de-kolmogorov]] en los [[espacios-equiprobables]], y reduce la probabilidad al conteo del [[principio-del-producto]] y de la combinatoria. Se contrasta con la [[interpretacion-frecuentista]], que define la probabilidad por la estabilidad de las frecuencias, y con la [[interpretacion-subjetiva-o-bayesiana]], que la define como grado de creencia. La [[probabilidad-geometrica]] extiende la misma idea a espacios infinitos, reemplazando el conteo por longitudes, áreas o volúmenes.

## Formulario

:::formula[Regla de Laplace]

$$
P(A) = \frac{|A|}{|\Omega|}
$$

- $|A|$: número de casos favorables.
- $|\Omega|$: número de casos posibles, todos igualmente posibles.
  :::

:::formula[Complemento]

$$
P(A^{c}) = 1 - \frac{|A|}{|\Omega|}
$$

- $A^{c}$: el evento "no ocurre $A$".
  :::

:::formula[Unión de eventos excluyentes]

$$
P(A \cup B) = \frac{|A| + |B|}{|\Omega|}, \qquad A \cap B = \varnothing
$$

- $A \cup B$: ocurre $A$ o $B$.
- $A \cap B = \varnothing$: $A$ y $B$ no pueden ocurrir a la vez.
  :::
