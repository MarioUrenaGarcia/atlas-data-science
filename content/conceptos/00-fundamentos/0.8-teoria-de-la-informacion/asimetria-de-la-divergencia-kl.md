---
id: asimetria-de-la-divergencia-kl
titulo: Asimetría de la divergencia KL (forward vs reverse)
titulo_en: Asymmetry of the KL divergence (forward vs reverse)
alias:
  - KL directa e inversa
  - forward KL
  - reverse KL
  - búsqueda de modos
  - cobertura de masa
modulo: 0
submodulo: '0.8'
orden: 8
nivel: intermedio
prerrequisitos:
  - divergencia-de-kullback-leibler
relaciones:
  - tipo: contrasta
    id: divergencia-de-jensen-shannon
etiquetas:
  - divergencia
  - aproximación de distribuciones
  - inferencia variacional
  - máxima verosimilitud
resumen: >
  Al aproximar p con un modelo q, minimizar KL(p || q) da un q que cubre toda la masa de p, y minimizar
  KL(q || p) da un q que se concentra en un solo modo. La elección del sentido cambia el ajuste.
formula: 'D_{\mathrm{KL}}(p \,\|\, q) = \int p \log \frac{p}{q}\,dx \;\ne\; D_{\mathrm{KL}}(q \,\|\, p) = \int q \log \frac{q}{p}\,dx'
visualizacion:
  componente: InformationViz
  parametros:
    modo: asimetria
    separacion: 0
referencias:
  - clave: bishop
    capitulo: '10.1'
  - clave: murphy
publicado: true
---

## Intuición

Un repartidor puede ir por la autopista o por el centro, y los tiempos de entrega forman una distribución con dos jorobas, una por cada camino. Se quiere resumirla con una sola campana normal. Hay dos maneras razonables de exigirle que se parezca, y dan respuestas distintas.

La primera castiga que la campana sea pequeña donde los datos son abundantes. Para no fallar en ninguna joroba, la campana se ensancha y las cubre a las dos, aunque así ponga mucha probabilidad en el valle intermedio, donde casi no hay datos. Es la divergencia directa, $D_{\mathrm{KL}}(p \,\|\, q)$, la que minimiza la máxima verosimilitud.

La segunda castiga que la campana ponga probabilidad donde los datos son escasos. Para no invadir el valle, la campana prefiere sentarse sobre una sola joroba y renunciar a la otra. Es la divergencia inversa, $D_{\mathrm{KL}}(q \,\|\, p)$, la que minimiza la inferencia variacional.

Ninguna es la correcta en general: la directa cubre la masa y la inversa busca un modo.

## Definición

:::definicion[Divergencias directa e inversa]
Sea $p$ una densidad que se quiere aproximar y $\mathcal{Q}$ una familia de densidades, por ejemplo las normales $\mathcal{N}(\mu, \sigma^2)$. La aproximación por divergencia directa es
$$
q_{\text{dir}} = \arg\min_{q \in \mathcal{Q}} D_{\mathrm{KL}}(p \,\|\, q) = \arg\min_{q \in \mathcal{Q}} \int p(x) \log \frac{p(x)}{q(x)}\,dx,
$$
y la aproximación por divergencia inversa es
$$
q_{\text{inv}} = \arg\min_{q \in \mathcal{Q}} D_{\mathrm{KL}}(q \,\|\, p) = \arg\min_{q \in \mathcal{Q}} \int q(x) \log \frac{q(x)}{p(x)}\,dx.
$$
:::

Cuando $\mathcal{Q}$ es la familia normal, $q_{\text{dir}}$ es la normal con la media y la varianza de $p$. El problema inverso no tiene fórmula general y puede tener varios mínimos.

:::nota[Qué significa cada símbolo]
- $p$: densidad que se aproxima.
- $q$: densidad aproximante, elegida en la familia $\mathcal{Q}$.
- $\mathcal{N}(\mu, \sigma^2)$: normal de media $\mu$ y varianza $\sigma^2$.
- $q_{\text{dir}}$, $q_{\text{inv}}$: mejores aproximaciones según cada sentido.
- $\arg\min$: el elemento que alcanza el mínimo.
- $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler, en nats con logaritmo natural.
:::

## Cómo usar la visualización

La curva gruesa es $p$, una mezcla en partes iguales de dos normales con desviación 0.6 y medias en $\pm d/2$. La curva continua delgada es la normal que minimiza $D_{\mathrm{KL}}(p \,\|\, q)$ y la punteada, la que minimiza $D_{\mathrm{KL}}(q \,\|\, p)$, buscada en una rejilla. La reproducción aumenta la separación $d$ de 0 a 5.

Con $d = 0$ las tres curvas coinciden. Hasta $d = 3.25$ las dos aproximaciones siguen centradas en cero, la inversa más angosta (1.525 contra 1.732). Entre 3.25 y 3.5 la inversa salta a una sola joroba, en $\mu = -1.75$ con $\sigma = 0.625$, mientras la directa sigue ensanchándose sobre el valle.

## Ejemplo

Con $d = 4$, la densidad $p$ es $\tfrac{1}{2}\mathcal{N}(-2, 0.36) + \tfrac{1}{2}\mathcal{N}(2, 0.36)$.

1. **Directa.** La media de $p$ es 0 y su varianza es $0.36 + 2^2 = 4.36$, de modo que $q_{\text{dir}} = \mathcal{N}(0, 2.088^2)$. Su densidad en 0 es $0.191$, aunque $p(0)$ es prácticamente cero.
2. **Inversa.** Si $q = \mathcal{N}(2, 0.36)$, la normal de una de las jorobas, en la zona donde $q$ tiene masa se cumple $p(x) \approx q(x)/2$. Entonces $D_{\mathrm{KL}}(q \,\|\, p) \approx \int q \log 2\,dx = \log 2 = 0.693$ nats.
3. La búsqueda en la rejilla confirma $q_{\text{inv}} = \mathcal{N}(\pm 2, 0.6^2)$ con divergencia 0.692, frente a $D_{\mathrm{KL}}(p \,\|\, q_{\text{dir}}) = 0.555$.

:::figura[Separación 4: la normal de la divergencia directa tiene media 0 y desviación 2.088 y cubre el valle vacío; la de la inversa se sienta en la joroba de $-2$ con desviación 0.6.]{componente="InformationViz"}
```yaml
modo: asimetria
separacion: 4
```
:::

## Propiedades

- **Cobertura de masa (directa):** $D_{\mathrm{KL}}(p \,\|\, q)$ es infinita si $q = 0$ donde $p > 0$, así que $q_{\text{dir}}$ se extiende sobre todo el soporte de $p$.
- **Búsqueda de modos (inversa):** $D_{\mathrm{KL}}(q \,\|\, p)$ es infinita si $q > 0$ donde $p = 0$, así que $q_{\text{inv}}$ evita las regiones donde $p$ es pequeña.
- **Varianza:** con la familia normal, $q_{\text{inv}}$ suele subestimar la varianza de $p$ y $q_{\text{dir}}$ la reproduce exactamente.

:::figura[Separación 2, modos poco marcados: las dos aproximaciones están centradas en cero, la directa con desviación 1.166 y la inversa más angosta; la animación muestra desde ahí cuándo se separan.]{componente="InformationViz"}
```yaml
modo: asimetria
separacion: 2
```
:::

- **Coincidencia:** si $p$ pertenece a la familia $\mathcal{Q}$, las dos aproximaciones son $p$ misma.
- **Máxima verosimilitud:** con una muestra grande de $p$, maximizar la verosimilitud de $q$ equivale a minimizar $D_{\mathrm{KL}}(p \,\|\, q)$.

## Errores comunes

- **Creer que el sentido no importa porque las dos son divergencias.** El resultado cambia de forma cualitativa: con modos separados, una aproximación se centra en el valle y la otra en una joroba.
- **Interpretar la aproximación directa como una buena descripción de los datos típicos.** Con separación 5 la normal de la divergencia directa tiene su máximo en 0, justo donde $p$ casi no tiene masa.

:::figura[Separación 5: la normal directa, con desviación 2.571, tiene su pico en 0, donde no hay datos; la inversa describe bien una de las jorobas y nada de la otra.]{componente="InformationViz"}
```yaml
modo: asimetria
separacion: 5
```
:::

- **Pensar que la aproximación inversa es única.** Con dos jorobas iguales hay dos mínimos simétricos; un algoritmo de optimización encuentra uno u otro según dónde empiece.

## Conexiones

Es la consecuencia práctica de que la [[divergencia-de-kullback-leibler]] no sea simétrica, estudiada para densidades, que se presentan en [[funcion-de-densidad-de-probabilidad]]. La [[divergencia-de-jensen-shannon]] evita la elección promediando con la mezcla, y las [[divergencias-f]] ofrecen comportamientos intermedios. La conexión con la máxima verosimilitud pasa por la [[entropia-cruzada]].

## Formulario

:::formula[Divergencia directa]
$$
D_{\mathrm{KL}}(p \,\|\, q) = \int p(x)\log\frac{p(x)}{q(x)}\,dx
$$

- $p$: densidad objetivo; $q$: aproximación; la esperanza se toma bajo $p$.
:::

:::formula[Divergencia inversa]
$$
D_{\mathrm{KL}}(q \,\|\, p) = \int q(x)\log\frac{q(x)}{p(x)}\,dx
$$

- La esperanza se toma bajo la aproximación $q$.
:::

:::formula[Ajuste normal directo]
$$
q_{\text{dir}} = \mathcal{N}\big(\mathbb{E}_p[X],\ \operatorname{Var}_p(X)\big)
$$

- $\mathbb{E}_p[X]$, $\operatorname{Var}_p(X)$: media y varianza de $p$.
:::

:::formula[Mezcla de dos normales]
$$
p(x) = \tfrac{1}{2}\mathcal{N}(x; -\tfrac{d}{2}, \sigma^2) + \tfrac{1}{2}\mathcal{N}(x; \tfrac{d}{2}, \sigma^2), \qquad \operatorname{Var}_p(X) = \sigma^2 + \tfrac{d^2}{4}
$$

- $d$: separación entre las medias; $\sigma$: desviación de cada componente; $\mathcal{N}(x; \mu, \sigma^2)$: densidad normal evaluada en $x$.
:::
