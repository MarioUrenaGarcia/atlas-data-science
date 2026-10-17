---
id: mezclas-de-distribuciones
titulo: Mezclas de distribuciones
titulo_en: Mixture distributions
alias:
  - mezcla finita
  - modelo de mezcla
  - mezcla de normales
modulo: 2
submodulo: '2.4'
orden: 5
nivel: intermedio
prerrequisitos:
  - distribucion-normal
  - ley-de-probabilidad-total
relaciones:
  - tipo: generaliza
    id: distribucion-de-poisson-inflada-en-ceros
  - tipo: relacionado
    id: distribuciones-compuestas
etiquetas:
  - mezclas
  - poblaciones ocultas
  - multimodalidad
  - varianza total
  - variable latente
resumen: >
  Distribución que resulta de elegir primero un grupo al azar y después generar el dato con la
  distribución de ese grupo. Su densidad es un promedio ponderado de densidades y puede tener varias modas.
formula: 'f(x) = \sum_{k=1}^{K} \pi_k\, f_k(x), \qquad \pi_k \ge 0,\ \sum_{k=1}^{K}\pi_k = 1'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: mezcla
    valores:
      w: 0.35
      m1: 2
      s1: 0.25
      m2: 4.4
      s2: 0.4
    casos:
      - nombre: 'Erupciones de un géiser'
        descripcion: 'Duraciones en minutos: 35 % de erupciones cortas cerca de 2 y 65 % largas cerca de 4.4; la mezcla tiene dos modas bien separadas.'
        valores: {w: 0.35, m1: 2, s1: 0.25, m2: 4.4, s2: 0.4}
      - nombre: 'Grupos traslapados'
        descripcion: 'Medias a 1.2 unidades con desviación 1: los grupos se traslapan tanto que la mezcla tiene una sola moda, más ancha que cada grupo.'
        valores: {w: 0.5, m1: -0.6, s1: 1, m2: 0.6, s2: 1}
      - nombre: 'Contaminación'
        descripcion: '95 % de mediciones buenas con desviación 0.5 y 5 % erróneas con desviación 3: una sola moda pero colas mucho más pesadas.'
        valores: {w: 0.95, m1: 0, s1: 0.5, m2: 0, s2: 3}
referencias:
  - clave: bishop
  - clave: murphy
  - clave: hastie-esl
publicado: true
---

## Intuición

Las erupciones de un géiser duran unas veces cerca de dos minutos y otras cerca de cuatro y medio, con muy pocas duraciones intermedias. El histograma tiene dos jorobas. Ninguna distribución clásica tiene esa forma, pero hay una explicación sencilla: hay dos tipos de erupción. Cada vez, la naturaleza "elige" un tipo y después la duración varía alrededor de su valor típico.

Una mezcla de distribuciones modela justamente ese proceso de dos pasos: primero se sortea a qué grupo pertenece el dato, con ciertas probabilidades llamadas pesos, y después se genera el dato con la distribución de ese grupo. La densidad resultante es el promedio ponderado de las densidades de los grupos. Si los grupos están separados aparecen varias modas; si se traslapan, la mezcla puede tener una sola moda pero más ancha.

Las mezclas sirven para describir poblaciones heterogéneas (estaturas de hombres y mujeres juntos), datos con errores ocasionales (mediciones buenas con unas cuantas desastrosas) y para agrupar datos cuando el grupo de cada observación no se conoce. En ese último caso el grupo es una variable latente: existe, pero no se observa.

## Definición

:::definicion[Mezcla finita]
Sean $f_1, \dots, f_K$ densidades y $\pi_1, \dots, \pi_K$ pesos con $\pi_k \ge 0$ y $\sum_k \pi_k = 1$. La **mezcla** es la distribución con densidad
$$
f(x) = \sum_{k=1}^{K} \pi_k\, f_k(x).
$$
Equivalentemente, si $Z$ es una variable categórica con $P(Z = k) = \pi_k$ y $X \mid Z = k \sim f_k$, entonces $X$ tiene la densidad $f$.
:::

Para una mezcla de normales $f_k = \mathcal{N}(\mu_k, \sigma_k^{2})$, la media y la varianza son
$$
\mathbb{E}[X] = \sum_k \pi_k\mu_k, \qquad \operatorname{Var}(X) = \underbrace{\sum_k \pi_k\sigma_k^{2}}_{\text{dentro}} + \underbrace{\sum_k \pi_k(\mu_k - \mathbb{E}[X])^{2}}_{\text{entre}}.
$$

:::nota[Qué es X]
$X$ = una observación de una población formada por varios grupos, como la duración en minutos de una erupción de un géiser que tiene erupciones cortas y largas.
:::

:::nota[Qué hace cada parámetro]
- **$\pi$, peso del primer grupo:** qué fracción de los datos viene de él. Si aumenta, su joroba crece y la del otro grupo baja.
- **$\mu_1, \mu_2$, medias:** dónde está cada grupo. Si se separan, aparecen dos modas y crece la varianza entre grupos.
- **$\sigma_1, \sigma_2$, desviaciones:** el ancho de cada grupo. Si aumentan, las jorobas se traslapan hasta fundirse en una sola moda.
:::

:::nota[Qué significa cada símbolo]
- $f$: densidad de la mezcla; $f_k$: densidad del grupo $k$; $K$: número de grupos.
- $\pi_k$: peso del grupo $k$; $Z$: grupo de pertenencia, una variable categórica latente.
- $\mu_k$, $\sigma_k$: media y desviación del grupo $k$.
- $\varphi(x; \mu, \sigma^{2})$: densidad normal con esa media y varianza.
:::

## Cómo usar la visualización

La curva gruesa es la densidad de la mezcla; las punteadas son los dos grupos multiplicados por sus pesos, que suman la curva gruesa. Al simular, el histograma apila los datos de cada grupo con su color, de modo que se ve qué parte de cada barra viene de cada población. El panel da la media, la varianza separada en dentro y entre grupos y el número de modas.

Carga el géiser y observa dos modas. Acerca las medias y observa en qué momento se funden en una sola. Carga la contaminación y observa una sola joroba, pero con colas que bajan más despacio que las de una normal.

## Ejemplo

La duración en minutos de las erupciones de un géiser se modela con $0.35\,\mathcal{N}(2, 0.25^{2}) + 0.65\,\mathcal{N}(4.4, 0.4^{2})$.

1. Media: $0.35 \cdot 2 + 0.65 \cdot 4.4 = 3.56$ minutos, un valor donde casi no hay erupciones.
2. Varianza dentro de los grupos: $0.35 \cdot 0.0625 + 0.65 \cdot 0.16 \approx 0.126$.
3. Varianza entre grupos: $0.35(2 - 3.56)^{2} + 0.65(4.4 - 3.56)^{2} \approx 0.852 + 0.459 = 1.310$.
4. Varianza total: $0.126 + 1.310 = 1.436$; casi toda viene de la diferencia entre los tipos de erupción.
5. $P(X < 3) = 0.35\,\Phi\!\left(\frac{3 - 2}{0.25}\right) + 0.65\,\Phi\!\left(\frac{3 - 4.4}{0.4}\right) = 0.35\,\Phi(4) + 0.65\,\Phi(-3.5) \approx 0.350$: prácticamente todas las erupciones cortas y ninguna larga.

:::figura[Erupciones de un géiser: dos grupos con pesos 0.35 y 0.65 forman una densidad con dos modas; la media 3.56 cae en el valle entre ellas.]{componente="FamilyLab"}
```yaml
modo: mezcla
valores:
  w: 0.35
  m1: 2
  s1: 0.25
  m2: 4.4
  s2: 0.4
```
:::

## Propiedades

- **Ley de probabilidad total:** $f(x) = \sum_k P(Z = k)\,f(x \mid Z = k)$; la mezcla es esta ley aplicada a densidades.
- **Media y varianza:** la media es el promedio ponderado de las medias, y la varianza es la de dentro de los grupos más la de entre grupos.
- **Pertenencia a posteriori:** $P(Z = k \mid X = x) = \frac{\pi_k f_k(x)}{f(x)}$; es la base del agrupamiento por mezclas.
- **Modas:** dos normales con la misma desviación forman una mezcla bimodal solo si sus medias se separan más de cierta distancia (más de $2\sigma$ con pesos iguales).
- **Colas:** una mezcla de normales con varianzas distintas tiene más curtosis que una normal.
- **Identificabilidad:** intercambiar las etiquetas de los grupos da la misma mezcla; los grupos se identifican solo hasta su orden.

:::figura[Casos con contexto (géiser, grupos traslapados, contaminación): cada botón carga pesos, medias y desviaciones, y una frase explica la forma de la mezcla.]{componente="FamilyLab"}
```yaml
modo: mezcla
valores:
  w: 0.5
  m1: -0.6
  s1: 1
  m2: 0.6
  s2: 1
casos:
  - nombre: 'Erupciones de un géiser'
    descripcion: 'Dos modas separadas.'
    valores: {w: 0.35, m1: 2, s1: 0.25, m2: 4.4, s2: 0.4}
  - nombre: 'Grupos traslapados'
    descripcion: 'Medias a 1.2 de distancia con σ = 1: una sola moda.'
    valores: {w: 0.5, m1: -0.6, s1: 1, m2: 0.6, s2: 1}
  - nombre: 'Contaminación'
    descripcion: '5 % de errores grandes: una moda con colas pesadas.'
    valores: {w: 0.95, m1: 0, s1: 0.5, m2: 0, s2: 3}
```
:::

:::figura[Umbral de la bimodalidad: con pesos iguales y σ = 1, las medias a distancia 2 dan una cima plana; al separarlas un poco más aparecen dos modas.]{componente="FamilyLab"}
```yaml
modo: mezcla
valores:
  w: 0.5
  m1: -1
  s1: 1
  m2: 1
  s2: 1
```
:::

## Errores comunes

- **Confundir la mezcla con la suma de variables.** La mezcla elige un grupo y genera un dato; la suma de dos normales independientes es otra normal, con una sola moda.
- **Ver dos grupos donde hay una sola población asimétrica.** Una distribución asimétrica puede ajustarse con una mezcla, pero eso no prueba que existan dos poblaciones.
- **Esperar dos modas siempre que haya dos grupos.** Si los grupos se traslapan, la mezcla puede ser unimodal.
- **Resumir una mezcla bimodal solo con su media.** La media puede caer en un valle donde casi no hay datos, como en el géiser.

:::figura[La media en el valle: con grupos en -2.5 y 2.5 la media de la mezcla es 0, justo donde la densidad casi se anula.]{componente="FamilyLab"}
```yaml
modo: mezcla
valores:
  w: 0.5
  m1: -2.5
  s1: 0.6
  m2: 2.5
  s2: 0.6
```
:::

## Conexiones

Es la [[ley-de-probabilidad-total]] aplicada a densidades, con una variable de grupo de la [[distribucion-categorica]]. La [[distribucion-de-poisson-inflada-en-ceros]] es una mezcla de un cero seguro con una Poisson, y mezclar la tasa de una Poisson con una gamma da la [[distribucion-binomial-negativa]]. Si el número de componentes que se suman es aleatorio se obtienen las [[distribuciones-compuestas]]. Los modelos de mezclas gaussianas son la base del agrupamiento probabilístico. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas relaciones.

## Formulario

:::formula[Densidad de una mezcla]
$$
f(x) = \sum_{k=1}^{K} \pi_k\, f_k(x)
$$

- $\pi_k$: pesos, no negativos y que suman uno; $f_k$: densidades de los grupos; $K$: número de grupos.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \sum_k \pi_k\mu_k, \qquad \operatorname{Var}(X) = \sum_k \pi_k\sigma_k^{2} + \sum_k \pi_k(\mu_k - \mathbb{E}[X])^{2}
$$

- $\mu_k$, $\sigma_k^{2}$: media y varianza de cada grupo.
:::

:::formula[Pertenencia a posteriori]
$$
P(Z = k \mid X = x) = \frac{\pi_k f_k(x)}{\sum_j \pi_j f_j(x)}
$$

- $Z$: grupo latente; $x$: dato observado.
:::

:::formula[Probabilidad de un intervalo]
$$
P(X < c) = \sum_k \pi_k\,\Phi\!\left(\frac{c - \mu_k}{\sigma_k}\right)
$$

- $\Phi$: distribución normal estándar; $c$: umbral.
:::
