---
id: paradoja-de-simpson
titulo: Paradoja de Simpson
titulo_en: Simpson's paradox
alias:
  - efecto Yule-Simpson
  - inversión de Simpson
  - paradoja de la agregación
modulo: 1
submodulo: '1.2'
orden: 16
nivel: basico
prerrequisitos:
  - ley-de-probabilidad-total
relaciones:
  - tipo: relacionado
    id: independencia-condicional
etiquetas:
  - paradojas
  - variables de confusión
  - agregación
  - promedios ponderados
resumen: >
  Una relación que se cumple dentro de cada subgrupo puede invertirse al juntar los subgrupos, porque
  los totales son promedios ponderados con pesos distintos para cada grupo comparado.
formula: 'P(E \mid T) = \sum_{g} P(E \mid T, g)\,P(g \mid T)'
visualizacion:
  componente: SimpsonParadox
  parametros:
    subgrupos: [cálculos pequeños, cálculos grandes]
    tratamientos:
      - nombre: Cirugía abierta
        datos:
          - exitos: 81
            total: 87
          - exitos: 192
            total: 263
      - nombre: Nefrolitotomía
        datos:
          - exitos: 234
            total: 270
          - exitos: 55
            total: 80
    exito: tratamiento exitoso
    contexto: Estudio sobre tratamientos de cálculos renales, separado por el tamaño del cálculo.
referencias:
  - clave: pearl
    capitulo: '1'
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

Un estudio compara dos tratamientos para cálculos renales. En los pacientes con cálculos pequeños, la cirugía abierta tiene éxito en 93 % de los casos y la nefrolitotomía percutánea en 87 %. En los cálculos grandes, la cirugía también gana: 73 % contra 69 %. Sin embargo, al juntar a todos los pacientes, la nefrolitotomía tiene 83 % de éxito y la cirugía solo 78 %. ¿Cómo puede un tratamiento ser mejor en cada grupo y peor en el total?

La explicación está en quién recibió cada tratamiento. Los médicos usaron la cirugía sobre todo para los cálculos grandes, que son más difíciles, y la nefrolitotomía para los pequeños. La tasa global de cada tratamiento es un promedio ponderado de sus tasas por grupo, y los pesos son muy distintos: 75 % de casos difíciles para la cirugía contra 23 % para la nefrolitotomía. La cirugía queda "castigada" por haber atendido los casos difíciles.

La paradoja de Simpson no es un error de cálculo: los dos conjuntos de números son correctos. La pregunta es cuál comparación responde la pregunta de interés, y eso depende de la estructura causal: aquí el tamaño del cálculo influye tanto en el tratamiento como en el resultado, así que la comparación correcta es dentro de cada grupo.

## Definición

:::definicion[Paradoja de Simpson]
Hay **inversión de Simpson** cuando, para eventos $E$ (éxito), $T$ (tratamiento) y una partición $g_1, \dots, g_k$ (subgrupos),
$$
P(E \mid T, g_i) > P(E \mid T^{c}, g_i) \text{ para todo } i, \quad \text{pero} \quad P(E \mid T) < P(E \mid T^{c}).
$$
:::

Por la ley de probabilidad total aplicada dentro de cada tratamiento,
$$
P(E \mid T) = \sum_{i} P(E \mid T, g_i)\,P(g_i \mid T),
$$
de modo que la tasa global es un promedio de las tasas por grupo, ponderado por la composición $P(g_i \mid T)$ de los pacientes de ese tratamiento. Si las composiciones difieren mucho, el orden puede invertirse.

:::figura[Dos bateadores de béisbol: David Justice tuvo mejor promedio de bateo que Derek Jeter en 1995 y en 1996, pero Jeter tuvo mejor promedio sumando las dos temporadas, porque la mayoría de sus turnos fueron en 1996, su mejor año.]{componente="SimpsonParadox"}
```yaml
subgrupos: [temporada 1995, temporada 1996]
tratamientos:
  - nombre: Jeter
    datos:
      - exitos: 12
        total: 48
      - exitos: 183
        total: 582
  - nombre: Justice
    datos:
      - exitos: 104
        total: 411
      - exitos: 45
        total: 140
exito: hit
```
:::

:::nota[Qué significa cada símbolo]
- $E$: éxito del tratamiento; $T$, $T^{c}$: recibir un tratamiento o el otro.
- $g_1, \dots, g_k$: subgrupos que forman una partición (por ejemplo, tamaño del cálculo); $k$ es cuántos son.
- $P(E \mid T, g_i)$: tasa de éxito del tratamiento $T$ en el subgrupo $g_i$.
- $P(g_i \mid T)$: proporción de los pacientes de $T$ que pertenecen al subgrupo $g_i$ (composición).
- $\sum_i$: suma sobre los subgrupos.
:::

## Cómo usar la visualización

A la izquierda, las barras comparan los dos tratamientos en cálculos pequeños, en cálculos grandes y en total; el contorno marca al ganador de cada comparación. La animación recorre las tres comparaciones en orden. A la derecha, el diagrama de Baker y Kramer dibuja cada tratamiento como un segmento que va de su tasa en cálculos pequeños (extremo izquierdo) a su tasa en cálculos grandes (extremo derecho). La tasa global es el punto del segmento ubicado en la proporción de cálculos grandes que atendió ese tratamiento.

El segmento de la cirugía está por encima en todo su recorrido, pero su punto está muy a la derecha (75 % de casos grandes) y el de la nefrolitotomía muy a la izquierda (23 %). Al mover los controles para igualar las dos proporciones, los puntos quedan en la misma vertical y la inversión desaparece: con composiciones iguales, la cirugía también gana en el total.

## Ejemplo

Se verifica la inversión con los datos del estudio.

1. Cirugía abierta: $81/87 = 93.1\,\%$ en cálculos pequeños y $192/263 = 73.0\,\%$ en grandes.
2. Nefrolitotomía: $234/270 = 86.7\,\%$ en pequeños y $55/80 = 68.8\,\%$ en grandes.
3. Totales: cirugía $(81 + 192)/350 = 273/350 = 78.0\,\%$; nefrolitotomía $(234 + 55)/350 = 289/350 = 82.6\,\%$.
4. Composición: la cirugía atendió $263/350 = 75\,\%$ de cálculos grandes; la nefrolitotomía, $80/350 = 23\,\%$.
5. Promedio ponderado de la cirugía: $0.25 \cdot 0.931 + 0.75 \cdot 0.730 = 0.780$; de la nefrolitotomía: $0.77 \cdot 0.867 + 0.23 \cdot 0.688 = 0.826$.

:::figura[Las tasas globales como probabilidad total: dentro de la cirugía, la columna de cálculos grandes ocupa el 75 % del ancho y tiene la menor tasa de éxito, lo que baja el área total de éxito a 0.78.]{componente="ProbabilitySquare"}
```yaml
modo: total
particion:
  - etiqueta: Pequeños
    prob: 0.2485714286
  - etiqueta: Grandes
    prob: 0.7514285714
evento: Éxito
complemento: fracaso
condicionales: [0.931, 0.73]
contexto: Pacientes tratados con cirugía abierta.
```
:::

## Propiedades

- **Condición necesaria:** la inversión requiere que la variable de agrupación esté asociada tanto con el tratamiento (composiciones distintas) como con el resultado (tasas distintas entre grupos).
- **Sin inversión con composiciones iguales:** si $P(g_i \mid T) = P(g_i \mid T^{c})$ para todo $i$, el orden global coincide con el de los grupos.
- **Qué tabla usar:** si el grupo es una causa común del tratamiento y del resultado (un confusor), se comparan los grupos; si el grupo es una consecuencia del tratamiento, la comparación correcta es la global. Los números no deciden; la estructura causal sí.
- **Variables continuas:** la misma inversión ocurre con regresiones: una pendiente puede ser negativa dentro de cada grupo y positiva al juntar los grupos.

:::figura[Sin desequilibrio en la composición no hay paradoja: los dos tratamientos atienden 100 casos de cada tipo, y el que gana en cada subgrupo también gana en el total.]{componente="SimpsonParadox"}
```yaml
subgrupos: [casos leves, casos graves]
tratamientos:
  - nombre: Tratamiento A
    datos:
      - exitos: 90
        total: 100
      - exitos: 60
        total: 100
  - nombre: Tratamiento B
    datos:
      - exitos: 85
        total: 100
      - exitos: 55
        total: 100
```
:::

## Errores comunes

- **Concluir que un tratamiento es mejor por los totales,** sin revisar si los grupos comparados tienen composiciones distintas.
- **Pensar que siempre se debe separar por grupos.** Separar por una variable que es consecuencia del tratamiento introduce sesgo; la decisión depende de la causalidad.
- **Atribuir la inversión a muestras pequeñas.** La paradoja aparece igual con millones de datos; es una propiedad de los promedios ponderados, no del azar.

:::figura[El caso de los bateadores: cada temporada Justice está por encima, pero el punto de Jeter queda en la zona de 1996, su mejor año, mientras que el de Justice queda cerca de 1995.]{componente="SimpsonParadox"}
```yaml
subgrupos: [temporada 1995, temporada 1996]
tratamientos:
  - nombre: Jeter
    datos:
      - exitos: 12
        total: 48
      - exitos: 183
        total: 582
  - nombre: Justice
    datos:
      - exitos: 104
        total: 411
      - exitos: 45
        total: 140
exito: hit
contexto: Promedios de bateo de dos jugadores en las temporadas de 1995 y 1996.
```
:::

## Conexiones

La paradoja es una consecuencia de la [[ley-de-probabilidad-total]]: las tasas globales son promedios ponderados por composiciones distintas. Se relaciona con la [[independencia-condicional]], porque una variable de grupo puede crear o borrar asociaciones, y con la [[probabilidad-condicional]] cuando se olvida en qué se está condicionando. En estadística aplicada motiva el ajuste por variables de confusión, la estandarización de tasas y los métodos de inferencia causal que distinguen confusores de mediadores.

## Formulario

:::formula[Tasa global como promedio ponderado]
$$
P(E \mid T) = \sum_{i=1}^{k} P(E \mid T, g_i)\,P(g_i \mid T)
$$

- $P(g_i \mid T)$: composición de los casos de $T$; son los pesos del promedio.
:::

:::formula[Condición de inversión]
$$
P(E \mid T, g_i) > P(E \mid T^{c}, g_i) \ \forall i \quad \text{y} \quad P(E \mid T) < P(E \mid T^{c})
$$

- $\forall i$: para todos los subgrupos.
:::

:::formula[Tasa estandarizada]
$$
P_{\text{std}}(E \mid T) = \sum_{i=1}^{k} P(E \mid T, g_i)\,w_i
$$

- $w_i$: pesos comunes para ambos tratamientos (por ejemplo, la composición de la población total), que eliminan el efecto de composición.
:::
