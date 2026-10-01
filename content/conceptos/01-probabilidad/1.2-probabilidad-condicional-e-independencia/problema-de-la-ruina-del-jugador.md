---
id: problema-de-la-ruina-del-jugador
titulo: Problema de la ruina del jugador
titulo_en: Gambler's ruin problem
alias:
  - ruina del jugador
  - caminata aleatoria con barreras absorbentes
modulo: 1
submodulo: '1.2'
orden: 18
nivel: basico
prerrequisitos:
  - ley-de-probabilidad-total
  - relaciones-de-recurrencia-lineales
relaciones:
  - tipo: relacionado
    id: falacia-del-jugador
etiquetas:
  - caminatas aleatorias
  - barreras absorbentes
  - recurrencias
  - juegos de azar
resumen: >
  Un jugador con k unidades apuesta una unidad por ronda hasta llegar a N o quedarse sin nada. Con
  juego justo, llega a N con probabilidad k/N; con una pequeña desventaja, la ruina se vuelve casi segura.
formula: 'P_k = \frac{1 - (q/p)^{k}}{1 - (q/p)^{N}} \ (p \neq q), \qquad P_k = \frac{k}{N} \ (p = q)'
visualizacion:
  componente: GamblersRuin
  parametros:
    inicial: 5
    meta: 10
    p: 0.5
    partidas: 300
referencias:
  - clave: ross-procesos
    capitulo: '4'
  - clave: karlin-taylor
publicado: true
---

## Intuición

Una jugadora entra al casino con 5 fichas y se propone irse cuando tenga 10. En cada ronda apuesta una ficha y gana o pierde una con la misma probabilidad. ¿Qué tan probable es que alcance su meta antes de perderlo todo? Si el juego es justo, la respuesta es simple y elegante: la mitad de las veces, porque está a medio camino de la meta. Con 2 fichas y meta de 10, solo lo lograría el 20 % de las veces.

La situación cambia drásticamente con una desventaja pequeña. En la ruleta americana, apostar al rojo gana con probabilidad $18/38 \approx 0.474$. Con 10 fichas y meta de 20, la probabilidad de llegar a la meta baja de 0.5 a 0.26. La desventaja por ronda es pequeña, pero se acumula a lo largo de las muchas rondas que dura el juego.

El razonamiento se basa en condicionar en el resultado de la primera apuesta: la probabilidad de ganar desde $k$ es el promedio de ganar desde $k+1$ y desde $k-1$, ponderado por $p$ y $q$. Esa ecuación es una recurrencia lineal cuya solución da la fórmula.

## Definición

Una jugadora tiene $k$ unidades, con $0 < k < N$. En cada ronda gana una unidad con probabilidad $p$ y pierde una con probabilidad $q = 1 - p$, independientemente de las demás rondas. El juego termina al llegar a $0$ (ruina) o a $N$ (meta).

:::teorema[Ruina del jugador]
La probabilidad $P_k$ de llegar a $N$ antes que a $0$ es
$$
P_k = \begin{cases} \dfrac{1 - (q/p)^{k}}{1 - (q/p)^{N}}, & p \neq q, \\[2mm] \dfrac{k}{N}, & p = q = \tfrac{1}{2}. \end{cases}
$$
La duración esperada del juego es $k(N - k)$ cuando $p = q$.
:::

:::demostracion
Condicionando en la primera ronda, por la ley de probabilidad total, $P_k = p\,P_{k+1} + q\,P_{k-1}$, con $P_0 = 0$ y $P_N = 1$. Escribiendo $P_k = (p + q)P_k$ y reordenando, $P_{k+1} - P_k = (q/p)(P_k - P_{k-1})$, de modo que las diferencias forman una progresión geométrica de razón $q/p$: $P_{k} = P_1 \sum_{j=0}^{k-1} (q/p)^j$. La condición $P_N = 1$ fija $P_1$ y da la fórmula; si $q/p = 1$, las diferencias son iguales y $P_k = k/N$.
:::

:::figura[La recurrencia como árbol de un paso: desde 5 fichas se pasa a 6 con probabilidad p o a 4 con probabilidad q, y la probabilidad de ganar es el promedio ponderado de ganar desde 6 (0.6) y desde 4 (0.4).]{componente="ProbabilityTree"}
```yaml
niveles: [Primera apuesta, Resultado final]
ramas:
  - etiqueta: Gana (6 fichas)
    prob: 0.5
    ramas:
      - etiqueta: Meta
        prob: 0.6
      - etiqueta: Ruina
        prob: 0.4
  - etiqueta: Pierde (4 fichas)
    prob: 0.5
    ramas:
      - etiqueta: Meta
        prob: 0.4
      - etiqueta: Ruina
        prob: 0.6
consultas:
  - nombre: Llega a la meta
    hojas: [Gana (6 fichas)/Meta, Pierde (4 fichas)/Meta]
```
:::

:::nota[Qué significa cada símbolo]
- $k$: capital inicial, en unidades de apuesta; $N$: meta.
- $p$: probabilidad de ganar cada ronda; $q = 1 - p$: de perderla.
- $P_k$: probabilidad de llegar a $N$ antes que a $0$ empezando con $k$.
- $q/p$: razón entre las probabilidades de perder y de ganar una ronda.
- $D_k$: número esperado de rondas hasta que el juego termina.
:::

## Cómo usar la visualización

Cada línea escalonada es una partida: el capital sube o baja una unidad por apuesta hasta tocar la línea de la meta o la de la ruina. La partida en curso se dibuja con trazo oscuro y las terminadas quedan atenuadas, con el color de su final. El panel compara la proporción de partidas que llegan a la meta y la duración media con los valores exactos.

Con capital 5, meta 10 y $p = 0.5$, cerca de la mitad de las partidas llega a la meta y la duración media es cercana a 25 apuestas. Al bajar el capital inicial a 2, la proporción cae a 0.2. Con $p = 0.47$ y capital 10, meta 20, la probabilidad exacta es 0.23 y las partidas duran cerca de 90 apuestas.

## Ejemplo

Un jugador con 10 dólares apuesta 1 dólar al rojo en la ruleta americana ($p = 18/38$) y se retira al llegar a 20.

1. $q/p = (20/38)/(18/38) = 10/9 \approx 1.111$.
2. $P_{10} = \dfrac{1 - (10/9)^{10}}{1 - (10/9)^{20}} = \dfrac{1 - 2.868}{1 - 8.225} \approx 0.259$.
3. Con un juego justo sería 0.5. La desventaja de 2.6 puntos por ronda reduce casi a la mitad sus posibilidades.
4. Si apostara 10 dólares de una vez, ganaría con probabilidad $18/38 \approx 0.474$: con desventaja, conviene apostar fuerte y pocas veces.

:::figura[Una desventaja pequeña por ronda (p = 0.47) con capital 10 y meta 20: la mayoría de las partidas termina en la ruina, y la probabilidad exacta de llegar a la meta es 0.23.]{componente="GamblersRuin"}
```yaml
inicial: 10
meta: 20
p: 0.47
partidas: 200
```
:::

## Propiedades

- **El juego termina:** con probabilidad 1 se llega a $0$ o a $N$; no hay partidas infinitas.
- **Juego justo:** $P_k = k/N$ y la duración esperada es $k(N - k)$; por ejemplo, 25 rondas con $k = 5$ y $N = 10$.
- **Capital infinito del rival:** si la meta crece sin límite y $p \le 1/2$, la ruina es segura, aunque con $p = 1/2$ la duración esperada es infinita.
- **Escala del capital:** con $p < 1/2$, duplicar capital y meta reduce la probabilidad de ganar: con $p = 0.47$, pasar de $(10, 20)$ a $(20, 40)$ la baja de 0.23 a 0.08.
- **Con ventaja:** si $p > 1/2$, la probabilidad de llegar a la meta es alta incluso con poco capital relativo.

:::figura[Con ventaja (p = 0.55), capital 10 y meta 20, la jugadora llega a la meta en cerca del 88 % de las partidas.]{componente="GamblersRuin"}
```yaml
inicial: 10
meta: 20
p: 0.55
partidas: 200
```
:::

## Errores comunes

- **Creer que un juego con pequeña desventaja es "casi justo" a la larga.** La desventaja se acumula en cada ronda; el efecto sobre la probabilidad final es grande.
- **Pensar que la estrategia de apuestas puede vencer a la casa.** Ninguna combinación de apuestas de tamaño fijo convierte un juego desfavorable en favorable; solo cambia la distribución de resultados.
- **Olvidar que el juego justo también arruina al de menor capital.** Con $p = 1/2$, quien empieza con 2 de 10 fichas pierde el 80 % de las veces.

:::figura[Juego justo con poco capital: empezando con 2 fichas y meta de 10, solo una de cada cinco partidas llega a la meta, y la duración esperada es 16 apuestas.]{componente="GamblersRuin"}
```yaml
inicial: 2
meta: 10
p: 0.5
partidas: 300
```
:::

## Conexiones

El problema se resuelve con la [[ley-de-probabilidad-total]], condicionando en la primera apuesta, y con la teoría de [[relaciones-de-recurrencia-lineales]]. Es el ejemplo clásico de caminata aleatoria con barreras absorbentes y de cadena de Markov con estados absorbentes; la fórmula de la probabilidad de ruina es un caso del teorema de paro opcional de las martingalas. Complementa a la [[falacia-del-jugador]]: aunque las apuestas no tengan memoria, el capital finito hace que la desventaja se manifieste con certeza a largo plazo.

## Formulario

:::formula[Probabilidad de llegar a la meta]
$$
P_k = \frac{1 - (q/p)^{k}}{1 - (q/p)^{N}}, \qquad p \neq q
$$

- $k$: capital inicial; $N$: meta; $q/p$: razón de probabilidades de perder y ganar.
:::

:::formula[Juego justo]
$$
P_k = \frac{k}{N}, \qquad D_k = k(N - k), \qquad p = q = \tfrac{1}{2}
$$

- $D_k$: duración esperada en rondas.
:::

:::formula[Recurrencia]
$$
P_k = p\,P_{k+1} + q\,P_{k-1}, \qquad P_0 = 0, \ P_N = 1
$$

- Condiciona en el resultado de la primera ronda.
:::

:::formula[Duración esperada con p distinto de q]
$$
D_k = \frac{k}{q - p} - \frac{N}{q - p}\,P_k
$$

- $D_k$: número esperado de rondas desde el capital $k$.
:::
