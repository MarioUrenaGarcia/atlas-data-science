---
id: principio-de-inclusion-y-exclusion
titulo: Principio de inclusión y exclusión
titulo_en: Inclusion-exclusion principle
alias:
  - inclusión exclusión
  - principio de inclusión-exclusión
  - fórmula de Poincaré
modulo: 0
submodulo: '0.2'
orden: 15
nivel: basico
prerrequisitos:
  - principio-de-la-suma
  - diagramas-de-venn
etiquetas:
  - conteo
  - uniones
  - conjuntos que se traslapan
  - diagramas de Venn
resumen: >
  El tamaño de una unión de conjuntos que se traslapan se obtiene sumando los tamaños de los conjuntos,
  restando los de las intersecciones de dos, sumando los de tres, y así con signos alternados.
formula: '\left|\bigcup_{i=1}^{n} A_i\right| = \sum_{\varnothing \neq S \subseteq \{1, \dots, n\}} (-1)^{|S|+1} \left|\bigcap_{i \in S} A_i\right|'
visualizacion:
  componente: VennSets
  parametros:
    modo: inclusion-exclusion
    universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    conjuntos:
      - etiqueta: A
        elementos: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
      - etiqueta: B
        elementos: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
      - etiqueta: C
        elementos: [5, 10, 15, 20, 25, 30]
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

En una encuesta, 15 personas dicen leer el periódico, 10 escuchar la radio y 6 ver noticieros. ¿Cuántas personas se informan por algún medio? Sumar $15 + 10 + 6 = 31$ cuenta dos veces a quien usa dos medios y tres veces a quien usa los tres. Para corregir, se restan las personas de cada par de medios. Pero entonces quien usa los tres medios, que se sumó 3 veces, se restó también 3 veces (una por cada par que lo contiene), y quedó sin contar. Hay que volver a sumarlo una vez.

Ese vaivén de sumar, restar y volver a sumar es el principio de inclusión y exclusión. Al final, cada persona queda contada exactamente una vez, sin importar a cuántos conjuntos pertenezca. Su utilidad es enorme cuando las intersecciones son fáciles de contar aunque la unión no lo sea, como ocurre con los números divisibles entre varios primos o con los desarreglos.

## Definición

:::teorema[Inclusión y exclusión]
Para conjuntos finitos $A_1, \dots, A_n$,
$$
\left|\bigcup_{i=1}^{n} A_i\right| = \sum_{i} |A_i| - \sum_{i < j} |A_i \cap A_j| + \sum_{i < j < l} |A_i \cap A_j \cap A_l| - \dots + (-1)^{n+1}|A_1 \cap \dots \cap A_n|.
$$
:::

Para dos y tres conjuntos:
$$
|A \cup B| = |A| + |B| - |A \cap B|,
$$
$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|.
$$

:::demostracion
Un elemento que pertenece a exactamente $m \ge 1$ de los conjuntos aparece en $\binom{m}{j}$ de las intersecciones de $j$ conjuntos. Su contribución total es $\sum_{j=1}^{m} (-1)^{j+1}\binom{m}{j} = 1 - \sum_{j=0}^{m} (-1)^{j}\binom{m}{j} = 1 - (1 - 1)^m = 1$, por el teorema del binomio.
:::

:::nota[Qué significa cada símbolo]
- $A_1, \dots, A_n$: los conjuntos cuya unión se cuenta; $n$ es cuántos son.
- $S$: un subconjunto no vacío de índices $\{1, \dots, n\}$; $|S|$ es su tamaño.
- $\bigcap_{i \in S} A_i$: intersección de los conjuntos cuyos índices están en $S$.
- $(-1)^{|S|+1}$: signo del término, positivo con un número impar de conjuntos.
- $U$: universo; $\lfloor x \rfloor$: parte entera de $x$ (en el ejemplo de divisibilidad).
:::

## Cómo usar la visualización

El universo son los números del 1 al 30 y los conjuntos son los múltiplos de 2, de 3 y de 5. La reproducción aplica un término de la fórmula a la vez y sombrea las regiones afectadas, en verde si se suma y en naranja si se resta. El número grande de cada región indica cuántas veces se han contado sus elementos hasta ese momento.

Después de sumar los tres conjuntos, la región central, que contiene al 30, está contada 3 veces. Al restar las tres intersecciones de pares queda en 0, y el último término, que suma la intersección triple, la deja en 1. Al final todas las regiones quedan en 1 y el total parcial coincide con el tamaño de la unión, 22.

## Ejemplo

¿Cuántos números del 1 al 1000 no son divisibles entre 2, ni entre 3, ni entre 5?

1. $|A_2| = 500$, $|A_3| = 333$, $|A_5| = 200$, donde $A_d$ son los múltiplos de $d$.
2. Pares: $|A_2 \cap A_3| = \lfloor 1000/6 \rfloor = 166$, $|A_2 \cap A_5| = 100$, $|A_3 \cap A_5| = 66$.
3. Triple: $|A_2 \cap A_3 \cap A_5| = \lfloor 1000/30 \rfloor = 33$.
4. Unión: $500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$.
5. Por complemento, $1000 - 734 = 266$ números no son divisibles entre ninguno de los tres.

:::figura[Los números del 1 al 1000 del ejemplo, con los múltiplos de 2, de 3 y de 5 contados por región. La unión suma 734 y la región exterior contiene los 266 números que no son divisibles entre ninguno.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: ['2', '3', '5']
universo: Números del 1 al 1000
conteos:
  '2': 267
  '3': 134
  '5': 67
  '23': 133
  '25': 67
  '35': 33
  '235': 33
  ninguno: 266
consultas:
  - nombre: Múltiplos de 2, 3 o 5
    regiones: ['2', '3', '5', '23', '25', '35', '235']
  - nombre: Múltiplos de 2 y de 3
    regiones: ['23', '235']
  - nombre: Múltiplos de los tres
    regiones: ['235']
  - nombre: De ninguno
    regiones: [ninguno]
```
:::

## Propiedades

- **Forma complementaria:** el número de elementos que no están en ningún $A_i$ es $|U| - |A_1 \cup \dots \cup A_n| = \sum_{S} (-1)^{|S|}\left|\bigcap_{i \in S} A_i\right|$, con la intersección vacía igual a $U$.
- **Casos simétricos:** si todas las intersecciones de $j$ conjuntos tienen el mismo tamaño $N_j$, la fórmula se reduce a $\sum_{j} (-1)^{j+1}\binom{n}{j}N_j$.
- **Desigualdades de Bonferroni:** truncar la suma después de un término positivo da una cota superior; después de uno negativo, una cota inferior.
- **Probabilidad:** la misma fórmula vale con $P$ en lugar de $|\cdot|$.

## Errores comunes

- **Detenerse en las intersecciones de dos.** Con tres conjuntos, olvidar sumar la triple intersección deja sin contar a los elementos comunes.
- **Equivocar los signos.** Los términos con un número impar de conjuntos se suman y los de número par se restan.
- **Calcular mal las intersecciones de divisibilidad.** Los múltiplos de 4 y de 6 a la vez son los múltiplos de 12, no de 24.

## Conexiones

El principio generaliza el [[principio-de-la-suma]] a conjuntos que se traslapan y se lee directamente en los [[diagramas-de-venn]]. Su demostración usa el [[teorema-del-binomio]]. Permite contar los [[desarreglos]] y las funciones suprayectivas, y está detrás de la fórmula explícita de los [[numeros-de-stirling-de-segunda-especie]]. En probabilidad da la probabilidad de una unión de eventos y resuelve el problema clásico de las coincidencias.

## Formulario

:::formula[Dos conjuntos]
$$
|A \cup B| = |A| + |B| - |A \cap B|
$$

- $|A \cap B|$: los comunes, contados dos veces en la suma.
:::

:::formula[Tres conjuntos]
$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|
$$

- Se suman los conjuntos, se restan las intersecciones de dos y se suma la de tres.
:::

:::formula[Forma general]
$$
\left|\bigcup_{i=1}^{n} A_i\right| = \sum_{\varnothing \neq S \subseteq \{1, \dots, n\}} (-1)^{|S|+1} \left|\bigcap_{i \in S} A_i\right|
$$

- $S$: cada grupo de índices.
- $|S|$: cuántos conjuntos intervienen en ese término.
:::

:::formula[Ninguno de los conjuntos]
$$
|U| - \left|\bigcup_{i} A_i\right| = \sum_{S \subseteq \{1, \dots, n\}} (-1)^{|S|} \left|\bigcap_{i \in S} A_i\right|
$$

- La intersección vacía ($S = \varnothing$) se toma igual a $U$.
:::

:::formula[Múltiplos de d hasta N]
$$
|A_d| = \left\lfloor \frac{N}{d} \right\rfloor
$$

- $N$: último número considerado; $d$: divisor.
:::
